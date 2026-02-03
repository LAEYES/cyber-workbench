using NSec.Cryptography;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    private string RiskEventsPath => Path.Combine(RootDir, "riskEvents.jsonl");
    private string CaseEventsPath => Path.Combine(RootDir, "caseEvents.jsonl");

    private static string Sha256Hex(string s)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(s));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static JsonNode? Canonicalize(JsonNode? node)
    {
        switch (node)
        {
            case null:
                return null;
            case JsonObject obj:
            {
                var sorted = new JsonObject();
                foreach (var kv in obj.OrderBy(k => k.Key, StringComparer.Ordinal))
                    sorted[kv.Key] = Canonicalize(kv.Value);
                return sorted;
            }
            case JsonArray arr:
            {
                var a = new JsonArray();
                foreach (var it in arr)
                    a.Add(Canonicalize(it));
                return a;
            }
            default:
                return node.DeepClone();
        }
    }

    private static string CanonicalJson(JsonNode node)
    {
        var canon = Canonicalize(node) ?? new JsonObject();
        return canon.ToJsonString(new JsonSerializerOptions { WriteIndented = false });
    }

    private string GetLastHashOrGenesis(string filePath)
    {
        if (!File.Exists(filePath)) return "GENESIS";

        string? last = null;
        foreach (var line in File.ReadLines(filePath, Encoding.UTF8))
        {
            var l = line.Trim();
            if (l.Length == 0) continue;
            last = l;
        }
        if (last is null) return "GENESIS";

        try
        {
            var node = JsonNode.Parse(last) as JsonObject;
            var hash = node?["hash"]?.GetValue<string>();
            return string.IsNullOrWhiteSpace(hash) ? "GENESIS" : hash;
        }
        catch
        {
            return "GENESIS";
        }
    }

    private void AppendChainedEvent(string filePath, JsonObject eventWithoutHash)
    {
        EnsureDir(RootDir);

        // prevHash is part of signed material
        var prevHash = GetLastHashOrGenesis(filePath);
        eventWithoutHash["prevHash"] = prevHash;

        var canonical = CanonicalJson(eventWithoutHash);
        var hash = Sha256Hex(prevHash + "\n" + canonical);

        var full = (JsonObject)eventWithoutHash.DeepClone();
        full["hash"] = hash;

        File.AppendAllText(filePath, full.ToJsonString(new JsonSerializerOptions { WriteIndented = false }) + "\n", Encoding.UTF8);
    }

    private void AppendRiskSnapshotEvent(string actor, string action, MvpRisk risk)
    {
        var ev = new JsonObject
        {
            ["eventId"] = NewId("re"),
            ["orgId"] = OrgId,
            ["entityType"] = "risk",
            ["entityId"] = risk.RiskId,
            ["action"] = action,
            ["actor"] = actor,
            ["timestamp"] = NowIso(),
            ["snapshot"] = JsonSerializer.SerializeToNode(risk)!
        };

        AppendChainedEvent(RiskEventsPath, ev);
    }

    private void AppendCaseSnapshotEvent(string actor, string action, MvpCase c)
    {
        var ev = new JsonObject
        {
            ["eventId"] = NewId("ce"),
            ["orgId"] = OrgId,
            ["entityType"] = "case",
            ["entityId"] = c.CaseId,
            ["action"] = action,
            ["actor"] = actor,
            ["timestamp"] = NowIso(),
            ["snapshot"] = JsonSerializer.SerializeToNode(c)!
        };

        AppendChainedEvent(CaseEventsPath, ev);
    }

    public (int total, int legacy, int verified) VerifyEntityEvents(string actor)
    {
        var r = VerifyChainedEvents(RiskEventsPath);
        var c = VerifyChainedEvents(CaseEventsPath);

        EmitAudit(actor, "human", "store.verifyEntityEvents", $"store:{OrgId}", (r.ok && c.ok) ? "success" : "fail");

        return (r.total + c.total, r.legacy + c.legacy, r.verified + c.verified);
    }

    public (bool ok, string details, int total, int legacy, int verified) VerifyEntityEventsDetailed()
    {
        var r = VerifyChainedEvents(RiskEventsPath);
        var c = VerifyChainedEvents(CaseEventsPath);
        var ok = r.ok && c.ok;

        var details = ok
            ? "OK"
            : $"riskEvents: {(r.ok ? "OK" : r.error)}; caseEvents: {(c.ok ? "OK" : c.error)}";

        return (ok, details, r.total + c.total, r.legacy + c.legacy, r.verified + c.verified);
    }

    public (string riskHead, string caseHead) GetEventHeadHashes()
    {
        var r = GetLastHashOrGenesis(RiskEventsPath);
        var c = GetLastHashOrGenesis(CaseEventsPath);
        return (r, c);
    }

    public string ExportAuditAnchor(string actor, string? privateKeyPath, string keyId)
    {
        EnsureDir(RootDir);

        var (riskHead, caseHead) = GetEventHeadHashes();
        var auditEventsPath = Path.Combine(RootDir, "auditEvents.jsonl");
        var auditEventsHash = File.Exists(auditEventsPath) ? Sha256File(auditEventsPath) : "MISSING";

        var anchor = new JsonObject
        {
            ["anchorVersion"] = "1.0",
            ["orgId"] = OrgId,
            ["generatedAt"] = NowIso(),
            ["generatedBy"] = "WinForms NATO MVP",
            ["riskHeadHash"] = riskHead,
            ["caseHeadHash"] = caseHead,
            ["auditEventsHash"] = auditEventsHash
        };

        // compute hash over canonical payload (without signature)
        var canonical = CanonicalJson(anchor);
        var anchorHash = Sha256Hex(canonical);
        anchor["anchorHash"] = anchorHash;

        if (!string.IsNullOrWhiteSpace(privateKeyPath))
        {
            var privBytes = Convert.FromBase64String(File.ReadAllText(privateKeyPath, Encoding.UTF8));
            var algorithm = SignatureAlgorithm.Ed25519;
            using var key = Key.Import(algorithm, privBytes, KeyBlobFormat.RawPrivateKey);

            var sig = algorithm.Sign(key, Encoding.UTF8.GetBytes(canonical));
            anchor["signature"] = new JsonObject
            {
                ["keyId"] = keyId,
                ["alg"] = "ed25519",
                ["value"] = Convert.ToBase64String(sig)
            };
        }

        var outPath = Path.Combine(RootDir, $"audit-anchor_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json");
        File.WriteAllText(outPath, anchor.ToJsonString(new JsonSerializerOptions { WriteIndented = true }) + "\n", Encoding.UTF8);

        EmitAudit(actor, "human", "store.exportAuditAnchor", $"anchor:{Path.GetFileName(outPath)}", "success");
        return outPath;
    }

    public (bool ok, string details) VerifyAuditAnchor(string actor, string anchorPath, string? publicKeyPath)
    {
        anchorPath = Path.GetFullPath(anchorPath);
        if (!File.Exists(anchorPath)) throw new FileNotFoundException(anchorPath);

        var node = JsonNode.Parse(File.ReadAllText(anchorPath, Encoding.UTF8)) as JsonObject;
        if (node is null) throw new InvalidOperationException("Invalid anchor JSON");

        var sigNode = node["signature"] as JsonObject;
        node.Remove("signature");
        var anchorHashIn = node["anchorHash"]?.GetValue<string>();
        node.Remove("anchorHash");

        var canonical = CanonicalJson(node);
        var computed = Sha256Hex(canonical);

        if (!string.Equals(computed, anchorHashIn, StringComparison.OrdinalIgnoreCase))
        {
            EmitAudit(actor, "human", "store.verifyAuditAnchor", $"anchor:{Path.GetFileName(anchorPath)}", "fail");
            return (false, $"ANCHOR_HASH_MISMATCH expected={anchorHashIn} computed={computed}");
        }

        // Verify signature if present
        if (sigNode is not null)
        {
            if (string.IsNullOrWhiteSpace(publicKeyPath))
                return (false, "ANCHOR_SIGNED_BUT_NO_PUBLIC_KEY");

            var alg = sigNode["alg"]?.GetValue<string>();
            var val = sigNode["value"]?.GetValue<string>();
            var keyId = sigNode["keyId"]?.GetValue<string>();
            if (!string.Equals(alg, "ed25519", StringComparison.OrdinalIgnoreCase))
                return (false, $"UNSUPPORTED_ALG {alg}");

            var pubBytes = Convert.FromBase64String(File.ReadAllText(publicKeyPath, Encoding.UTF8));
            var algorithm = SignatureAlgorithm.Ed25519;
            var pk = PublicKey.Import(algorithm, pubBytes, KeyBlobFormat.RawPublicKey);
            var okSig = algorithm.Verify(pk, Encoding.UTF8.GetBytes(canonical), Convert.FromBase64String(val ?? ""));
            if (!okSig)
            {
                EmitAudit(actor, "human", "store.verifyAuditAnchor", $"anchor:{Path.GetFileName(anchorPath)}", "fail");
                return (false, $"SIGNATURE_INVALID keyId={keyId}");
            }
        }

        // Compare current store hashes to anchor
        var riskHead = node["riskHeadHash"]?.GetValue<string>() ?? "";
        var caseHead = node["caseHeadHash"]?.GetValue<string>() ?? "";
        var auditEventsHash = node["auditEventsHash"]?.GetValue<string>() ?? "";

        var (curRisk, curCase) = GetEventHeadHashes();
        var auditEventsPath = Path.Combine(RootDir, "auditEvents.jsonl");
        var curAudit = File.Exists(auditEventsPath) ? Sha256File(auditEventsPath) : "MISSING";

        var drift = new List<string>();
        if (!string.Equals(curRisk, riskHead, StringComparison.OrdinalIgnoreCase)) drift.Add($"riskHead drift: anchor={riskHead} current={curRisk}");
        if (!string.Equals(curCase, caseHead, StringComparison.OrdinalIgnoreCase)) drift.Add($"caseHead drift: anchor={caseHead} current={curCase}");
        if (!string.Equals(curAudit, auditEventsHash, StringComparison.OrdinalIgnoreCase)) drift.Add($"auditEventsHash drift: anchor={auditEventsHash} current={curAudit}");

        var ok = drift.Count == 0;
        EmitAudit(actor, "human", "store.verifyAuditAnchor", $"anchor:{Path.GetFileName(anchorPath)}", ok ? "success" : "fail");
        return ok ? (true, "OK") : (false, string.Join("; ", drift));
    }

    public (int total, int migrated) MigrateLegacyToChained(string actor)
    {
        var r = MigrateToChained(RiskEventsPath);
        var c = MigrateToChained(CaseEventsPath);

        EmitAudit(actor, "human", "store.migrateLegacyToChained", $"store:{OrgId}", "success");

        return (r.total + c.total, r.migrated + c.migrated);
    }

    private static (bool ok, int total, int legacy, int verified, string? error) VerifyChainedEvents(string filePath)
    {
        if (!File.Exists(filePath)) return (true, 0, 0, 0, null);

        var prev = "GENESIS";
        var total = 0;
        var legacy = 0;
        var verified = 0;

        foreach (var line in File.ReadLines(filePath, Encoding.UTF8))
        {
            var l = line.Trim();
            if (l.Length == 0) continue;
            total++;

            JsonObject? obj;
            try
            {
                obj = JsonNode.Parse(l) as JsonObject;
            }
            catch (Exception ex)
            {
                return (false, total, legacy, verified, $"Invalid JSON at line {total}: {ex.Message}");
            }

            if (obj is null) return (false, total, legacy, verified, $"Invalid JSON object at line {total}");

            var hash = obj["hash"]?.GetValue<string>();
            var prevHash = obj["prevHash"]?.GetValue<string>();

            if (string.IsNullOrWhiteSpace(hash) || string.IsNullOrWhiteSpace(prevHash))
            {
                legacy++;
                // legacy lines are accepted but do not contribute to cryptographic verification
                continue;
            }

            if (!string.Equals(prevHash, prev, StringComparison.OrdinalIgnoreCase))
                return (false, total, legacy, verified, $"prevHash mismatch at line {total}");

            // recompute hash over canonical payload without the hash field
            var withoutHash = (JsonObject)obj.DeepClone();
            withoutHash.Remove("hash");

            var canonical = CanonicalJson(withoutHash);
            var computed = Sha256Hex(prev + "\n" + canonical);

            if (!string.Equals(computed, hash, StringComparison.OrdinalIgnoreCase))
                return (false, total, legacy, verified, $"hash mismatch at line {total}");

            verified++;
            prev = hash;
        }

        return (true, total, legacy, verified, null);
    }

    public (int risks, int cases) RebuildProjectionsFromEvents(string actor, bool verifyFirst = true)
    {
        if (verifyFirst)
        {
            var r = VerifyChainedEvents(RiskEventsPath);
            var c = VerifyChainedEvents(CaseEventsPath);
            if (!r.ok) throw new InvalidOperationException($"riskEvents verification failed: {r.error}");
            if (!c.ok) throw new InvalidOperationException($"caseEvents verification failed: {c.error}");
        }

        var risks = new Dictionary<string, MvpRisk>(StringComparer.OrdinalIgnoreCase);
        var cases = new Dictionary<string, MvpCase>(StringComparer.OrdinalIgnoreCase);

        if (File.Exists(RiskEventsPath))
        {
            foreach (var line in File.ReadLines(RiskEventsPath, Encoding.UTF8))
            {
                var l = line.Trim();
                if (l.Length == 0) continue;
                using var doc = JsonDocument.Parse(l);
                if (!doc.RootElement.TryGetProperty("snapshot", out var snap)) continue;
                var rr = snap.Deserialize<MvpRisk>();
                if (rr is null) continue;
                risks[rr.RiskId] = rr;
            }
        }

        if (File.Exists(CaseEventsPath))
        {
            foreach (var line in File.ReadLines(CaseEventsPath, Encoding.UTF8))
            {
                var l = line.Trim();
                if (l.Length == 0) continue;
                using var doc = JsonDocument.Parse(l);
                if (!doc.RootElement.TryGetProperty("snapshot", out var snap)) continue;
                var cc = snap.Deserialize<MvpCase>();
                if (cc is null) continue;
                cases[cc.CaseId] = cc;
            }
        }

        WriteDb(RisksPath, risks);
        WriteDb(CasesPath, cases);

        EmitAudit(actor, "human", "store.rebuildFromEvents", $"store:{OrgId}", "success");

        return (risks.Count, cases.Count);
    }
}
