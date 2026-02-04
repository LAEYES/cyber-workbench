using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    private string EvidencePath => Path.Combine(RootDir, "evidence.json");
    private string EvidenceBlobsDir => Path.Combine(RootDir, "evidence-blobs");
    private string ChainDir => Path.Combine(RootDir, "chain-of-custody");

    private static string Sha256HexUtf8(string s)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(s));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static string SafeName(string s)
    {
        var sb = new StringBuilder();
        foreach (var ch in s)
        {
            if (char.IsLetterOrDigit(ch) || ch is '.' or '_' or '-') sb.Append(ch);
            else sb.Append('_');
        }
        return sb.ToString();
    }

    private string ChainPath(string evidenceId)
    {
        EnsureDir(ChainDir);
        return Path.Combine(ChainDir, $"{SafeName(evidenceId)}.jsonl");
    }

    private static string GetLastEventHashOrGenesis(string jsonlPath)
    {
        if (!File.Exists(jsonlPath)) return new string('0', 64);

        string? last = null;
        foreach (var line in File.ReadLines(jsonlPath, Encoding.UTF8))
        {
            var l = line.Trim();
            if (l.Length == 0) continue;
            last = l;
        }
        if (last is null) return new string('0', 64);

        try
        {
            var obj = JsonNode.Parse(last) as JsonObject;
            var h = obj?["eventHash"]?.GetValue<string>();
            return string.IsNullOrWhiteSpace(h) ? new string('0', 64) : h;
        }
        catch
        {
            return new string('0', 64);
        }
    }

    private static string CanonicalCocBaseJson(MvpChainOfCustodyEventBase b)
    {
        // Build an object in a deterministic key order matching the CLI base object.
        var obj = new JsonObject
        {
            ["id"] = b.Id,
            ["type"] = b.Type,
            ["version"] = b.Version,
            ["createdAt"] = b.CreatedAt,
            ["createdBy"] = b.CreatedBy,
            ["eventId"] = b.EventId,
            ["evidenceId"] = b.EvidenceId,
            ["action"] = b.Action,
            ["actor"] = b.Actor,
            ["timestamp"] = b.Timestamp,
            ["prevHash"] = b.PrevHash,
            ["hashAlg"] = b.HashAlg,
            ["location"] = b.Location,
            ["details"] = b.Details is null ? new JsonObject() : JsonSerializer.SerializeToNode(b.Details)!
        };

        return obj.ToJsonString(new JsonSerializerOptions { WriteIndented = false });
    }

    private void AppendChainEvent(string actor, string evidenceId, string action, string? location, Dictionary<string, object?>? details)
    {
        EnsureDir(RootDir);
        EnsureDir(EvidenceBlobsDir);
        EnsureDir(ChainDir);

        var cocPath = ChainPath(evidenceId);
        var prevHash = GetLastEventHashOrGenesis(cocPath);

        var now = NowIso();
        var baseEv = new MvpChainOfCustodyEventBase(
            Id: NewId("coc"),
            Type: "chainOfCustodyEvent",
            Version: 1,
            CreatedAt: now,
            CreatedBy: actor,
            EventId: NewId("coc"),
            EvidenceId: evidenceId,
            Action: action,
            Actor: actor,
            Timestamp: now,
            PrevHash: prevHash,
            HashAlg: "sha256",
            Location: location,
            Details: details
        );

        var payload = CanonicalCocBaseJson(baseEv);
        var eventHash = Sha256HexUtf8(payload);
        var full = new MvpChainOfCustodyEvent(baseEv, eventHash);

        File.AppendAllText(cocPath, JsonSerializer.Serialize(full) + "\n", Encoding.UTF8);

        EmitAudit(actor, "human", "evidence.chain.append", $"evidence:{evidenceId}", "success");
    }

    public (MvpEvidence evidence, MvpAuditEvent audit) IngestEvidence(
        string actor,
        string inFile,
        string evidenceId,
        string evidenceType,
        string sourceSystem,
        string classification,
        string retentionClass,
        string? collectorId
    )
    {
        EnsureDir(RootDir);
        EnsureDir(EvidenceBlobsDir);

        var abs = Path.GetFullPath(inFile);
        if (!File.Exists(abs)) throw new FileNotFoundException(abs);

        var db = ReadDb<MvpEvidence>(EvidencePath);
        if (db.ContainsKey(evidenceId)) throw new InvalidOperationException($"Evidence already exists: {evidenceId}");

        var filename = Path.GetFileName(abs);
        var storedName = $"{SafeName(evidenceId)}_{SafeName(filename)}";
        var blobAbs = Path.Combine(EvidenceBlobsDir, storedName);
        File.Copy(abs, blobAbs, overwrite: true);

        var root = RootDir;
        var storageRef = Path.GetRelativePath(root, blobAbs).Replace('\\', '/');
        var hash = Sha256File(blobAbs);

        var now = NowIso();
        var e = new MvpEvidence(
            Id: NewId("evidence"),
            Type: "evidence",
            Version: 1,
            CreatedAt: now,
            CreatedBy: actor,
            UpdatedAt: now,
            OrgId: OrgId,
            EvidenceId: evidenceId,
            EvidenceType: evidenceType,
            SourceSystem: sourceSystem,
            CollectedAt: now,
            CollectorId: string.IsNullOrWhiteSpace(collectorId) ? actor : collectorId,
            Hash: hash,
            HashAlg: "sha256",
            StorageRef: storageRef,
            RetentionClass: retentionClass,
            Classification: classification,
            Metadata: new Dictionary<string, object?>()
        );

        db[evidenceId] = e;
        WriteDb(EvidencePath, db);

        var ae = EmitAudit(actor, "human", "evidence.ingest", $"evidence:{evidenceId}", "success");

        // Initial CoC event
        AppendChainEvent(actor, evidenceId, "collected", null, new Dictionary<string, object?>
        {
            ["sourceSystem"] = sourceSystem,
            ["storageRef"] = storageRef,
            ["hash"] = hash,
            ["hashAlg"] = "sha256"
        });

        return (e, ae);
    }

    public void LinkEvidenceToRisk(string actor, string riskId, string evidenceId)
    {
        var rdb = ReadDb<MvpRisk>(RisksPath);
        if (!rdb.TryGetValue(riskId, out var r)) throw new InvalidOperationException($"Risk not found: {riskId}");

        var list = (r.EvidenceRefs ?? Array.Empty<string>()).ToList();
        if (!list.Contains(evidenceId, StringComparer.OrdinalIgnoreCase)) list.Add(evidenceId);

        var updated = r with
        {
            EvidenceRefs = list.ToArray(),
            UpdatedAt = NowIso(),
            UpdatedBy = actor,
            Version = Math.Max(1, r.Version) + 1
        };

        rdb[riskId] = updated;
        WriteDb(RisksPath, rdb);
        AppendRiskSnapshotEvent(actor, "risk.linkEvidence", updated);
        EmitAudit(actor, "human", "risk.linkEvidence", $"risk:{riskId}", "success");
    }

    public void LinkEvidenceToCase(string actor, string caseId, string evidenceId)
    {
        var cdb = ReadDb<MvpCase>(CasesPath);
        if (!cdb.TryGetValue(caseId, out var c)) throw new InvalidOperationException($"Case not found: {caseId}");

        var list = (c.EvidenceRefs ?? Array.Empty<string>()).ToList();
        if (!list.Contains(evidenceId, StringComparer.OrdinalIgnoreCase)) list.Add(evidenceId);

        var updated = c with
        {
            EvidenceRefs = list.ToArray(),
            UpdatedAt = NowIso(),
            UpdatedBy = actor,
            Version = Math.Max(1, c.Version) + 1
        };

        cdb[caseId] = updated;
        WriteDb(CasesPath, cdb);
        AppendCaseSnapshotEvent(actor, "case.linkEvidence", updated);
        EmitAudit(actor, "human", "case.linkEvidence", $"case:{caseId}", "success");
    }

    public (bool ok, string details, string headHash) VerifyEvidenceChain(string evidenceId)
    {
        var cocPath = ChainPath(evidenceId);
        if (!File.Exists(cocPath)) return (false, "CHAIN_NOT_FOUND", "");

        var lines = File.ReadAllLines(cocPath, Encoding.UTF8).Select(l => l.Trim()).Where(l => l.Length > 0).ToList();
        if (lines.Count == 0) return (false, "CHAIN_EMPTY", "");

        var expectedPrev = new string('0', 64);
        string head = expectedPrev;

        for (var i = 0; i < lines.Count; i++)
        {
            MvpChainOfCustodyEvent? ev;
            try
            {
                ev = JsonSerializer.Deserialize<MvpChainOfCustodyEvent>(lines[i]);
            }
            catch (Exception ex)
            {
                return (false, $"INVALID_JSON index={i} {ex.Message}", "");
            }

            if (ev is null) return (false, $"NULL_EVENT index={i}", "");
            if (!string.Equals(ev.Base.HashAlg, "sha256", StringComparison.OrdinalIgnoreCase))
                return (false, $"BAD_HASHALG index={i}", "");

            if (!string.Equals(ev.Base.PrevHash, expectedPrev, StringComparison.OrdinalIgnoreCase))
                return (false, $"CHAIN_BROKEN index={i} prevHash={ev.Base.PrevHash} expected={expectedPrev}", "");

            var payload = CanonicalCocBaseJson(ev.Base);
            var recomputed = Sha256HexUtf8(payload);
            if (!string.Equals(recomputed, ev.EventHash, StringComparison.OrdinalIgnoreCase))
                return (false, $"HASH_MISMATCH index={i}", "");

            expectedPrev = ev.EventHash;
            head = ev.EventHash;
        }

        return (true, "OK", head);
    }

    public string ExportBundleFromStore(string actor, string scopeRef, string outDir, bool sign, string? privateKeyPath, string keyId, Action<string> log)
    {
        EnsureDir(RootDir);

        var risks = ReadDb<MvpRisk>(RisksPath);
        var decisions = ReadDb<MvpDecision>(DecisionsPath);
        var cases = ReadDb<MvpCase>(CasesPath);
        var evidences = ReadDb<MvpEvidence>(EvidencePath);

        var tmpDir = Path.Combine(Path.GetFullPath(outDir), "nato-mvp", ".tmp");
        Directory.CreateDirectory(tmpDir);

        var metaFiles = new List<string>();
        var scopeEvidenceRefs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (scopeRef.StartsWith("risk:", StringComparison.OrdinalIgnoreCase))
        {
            var riskId = scopeRef["risk:".Length..];
            if (!risks.TryGetValue(riskId, out var risk)) throw new InvalidOperationException($"Risk not found: {riskId}");

            var relDec = decisions.Values.Where(d => string.Equals(d.RiskId, riskId, StringComparison.OrdinalIgnoreCase)).ToList();

            var riskMetaPath = Path.Combine(tmpDir, $"risk_{SafeName(riskId)}.json");
            var decisionsMetaPath = Path.Combine(tmpDir, $"decisions_{SafeName(riskId)}.json");
            File.WriteAllText(riskMetaPath, JsonSerializer.Serialize(risk, new JsonSerializerOptions { WriteIndented = true }) + "\n", Encoding.UTF8);
            File.WriteAllText(decisionsMetaPath, JsonSerializer.Serialize(relDec, new JsonSerializerOptions { WriteIndented = true }) + "\n", Encoding.UTF8);
            metaFiles.Add(riskMetaPath);
            metaFiles.Add(decisionsMetaPath);

            foreach (var e in risk.EvidenceRefs ?? Array.Empty<string>()) scopeEvidenceRefs.Add(e);
            foreach (var e in relDec.SelectMany(d => d.EvidenceRefs ?? Array.Empty<string>())) scopeEvidenceRefs.Add(e);
        }
        else if (scopeRef.StartsWith("case:", StringComparison.OrdinalIgnoreCase))
        {
            var caseId = scopeRef["case:".Length..];
            if (!cases.TryGetValue(caseId, out var c)) throw new InvalidOperationException($"Case not found: {caseId}");

            var caseMetaPath = Path.Combine(tmpDir, $"case_{SafeName(caseId)}.json");
            File.WriteAllText(caseMetaPath, JsonSerializer.Serialize(c, new JsonSerializerOptions { WriteIndented = true }) + "\n", Encoding.UTF8);
            metaFiles.Add(caseMetaPath);

            var riskIds = c.RiskRefs ?? Array.Empty<string>();
            var relRisks = riskIds.Select(rid => risks.TryGetValue(rid, out var rr) ? rr : null).Where(x => x is not null).ToList();
            if (relRisks.Count > 0)
            {
                var risksMetaPath = Path.Combine(tmpDir, $"risks_for_case_{SafeName(caseId)}.json");
                File.WriteAllText(risksMetaPath, JsonSerializer.Serialize(relRisks, new JsonSerializerOptions { WriteIndented = true }) + "\n", Encoding.UTF8);
                metaFiles.Add(risksMetaPath);
            }

            var relDec = decisions.Values.Where(d => riskIds.Contains(d.RiskId, StringComparer.OrdinalIgnoreCase)).ToList();
            if (relDec.Count > 0)
            {
                var decisionsMetaPath = Path.Combine(tmpDir, $"decisions_for_case_{SafeName(caseId)}.json");
                File.WriteAllText(decisionsMetaPath, JsonSerializer.Serialize(relDec, new JsonSerializerOptions { WriteIndented = true }) + "\n", Encoding.UTF8);
                metaFiles.Add(decisionsMetaPath);
            }

            foreach (var e in c.EvidenceRefs ?? Array.Empty<string>()) scopeEvidenceRefs.Add(e);
            foreach (var rid in riskIds)
            {
                if (risks.TryGetValue(rid, out var rr))
                    foreach (var e in rr.EvidenceRefs ?? Array.Empty<string>()) scopeEvidenceRefs.Add(e);
            }
            foreach (var e in relDec.SelectMany(d => d.EvidenceRefs ?? Array.Empty<string>())) scopeEvidenceRefs.Add(e);
        }
        else
        {
            throw new InvalidOperationException("Only risk:<id> or case:<id> scopes are supported");
        }

        // Convert evidenceRefs to inputs (preserve evidenceId)
        var inputs = new List<MvpBundle.EvidenceInput>();

        // include meta files as additional evidence (auto evidenceId)
        foreach (var mf in metaFiles) inputs.Add(new MvpBundle.EvidenceInput(mf));

        foreach (var evidenceId in scopeEvidenceRefs)
        {
            if (!evidences.TryGetValue(evidenceId, out var e)) throw new InvalidOperationException($"Evidence not found: {evidenceId}");
            var abs = Path.Combine(RootDir, e.StorageRef.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(abs)) throw new FileNotFoundException(abs);

            // CoC: accessed
            AppendChainEvent(actor, evidenceId, "accessed", null, new Dictionary<string, object?> { ["reason"] = "export", ["scopeRef"] = scopeRef });

            inputs.Add(new MvpBundle.EvidenceInput(
                Path: abs,
                EvidenceId: e.EvidenceId,
                EvidenceType: e.EvidenceType,
                SourceSystem: e.SourceSystem,
                CollectedAt: e.CollectedAt,
                CollectorId: e.CollectorId,
                Classification: e.Classification,
                RetentionClass: e.RetentionClass
            ));
        }

        var bundleDir = MvpBundle.ExportEvidencePackageV2(
            outDir: outDir,
            scopeRef: scopeRef,
            orgId: OrgId,
            inputs: inputs,
            sign: sign,
            privateKeyPath: privateKeyPath,
            keyId: keyId,
            log: log
        );

        EmitAudit(actor, "human", "store.exportFromStore", $"bundle:{SafeName(scopeRef)}", "success");
        return bundleDir;
    }
}
