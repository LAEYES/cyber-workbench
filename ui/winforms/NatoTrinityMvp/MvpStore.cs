using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    private readonly JsonSerializerOptions _json = new() { WriteIndented = true };

    public string BaseDir { get; }
    public string OrgId { get; }

    public MvpStore(string baseDir, string orgId)
    {
        BaseDir = Path.GetFullPath(baseDir);
        OrgId = orgId;
    }

    private string RootDir => Path.Combine(BaseDir, "nato-mvp-store", OrgId);

    private string RisksPath => Path.Combine(RootDir, "risks.json");
    private string DecisionsPath => Path.Combine(RootDir, "decisions.json");
    private string CasesPath => Path.Combine(RootDir, "cases.json");
    private string AuditPath => Path.Combine(RootDir, "auditEvents.jsonl");

    private static string NowIso() => DateTime.UtcNow.ToString("O");

    private static string NewId(string prefix) => $"{prefix}_{Guid.NewGuid():D}";

    private static void EnsureDir(string p) => Directory.CreateDirectory(p);

    private Dictionary<string, T> ReadDb<T>(string filePath)
    {
        if (!File.Exists(filePath)) return new();
        var txt = File.ReadAllText(filePath, Encoding.UTF8);
        return JsonSerializer.Deserialize<Dictionary<string, T>>(txt) ?? new();
    }

    private void WriteDb<T>(string filePath, Dictionary<string, T> db)
    {
        EnsureDir(Path.GetDirectoryName(filePath)!);
        File.WriteAllText(filePath, JsonSerializer.Serialize(db, _json) + "\n", Encoding.UTF8);
    }

    public MvpAuditEvent EmitAudit(string actor, string actorType, string action, string objectRef, string outcome)
    {
        EnsureDir(RootDir);
        var ev = new MvpAuditEvent(
            EventId: NewId("ae"),
            OrgId: OrgId,
            Actor: actor,
            ActorType: actorType,
            Action: action,
            ObjectRef: objectRef,
            Timestamp: NowIso(),
            Outcome: outcome,
            RequestId: $"req_{Guid.NewGuid():D}"
        );

        File.AppendAllText(AuditPath, JsonSerializer.Serialize(ev) + "\n", Encoding.UTF8);
        return ev;
    }

    public (MvpRisk risk, MvpAuditEvent audit) CreateRisk(string actor, string riskId, string title, string owner, int likelihood, int impact, string dueDate, string status)
    {
        if (likelihood is < 1 or > 5) throw new ArgumentOutOfRangeException(nameof(likelihood));
        if (impact is < 1 or > 5) throw new ArgumentOutOfRangeException(nameof(impact));

        var db = ReadDb<MvpRisk>(RisksPath);
        if (db.ContainsKey(riskId)) throw new InvalidOperationException($"Risk already exists: {riskId}");

        var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "new",
            "open",
            "accepted",
            "mitigated",
            "closed"
        };
        if (!allowed.Contains(status)) throw new InvalidOperationException($"Invalid risk status: {status}");

        var now = NowIso();
        var r = new MvpRisk(
            Id: $"risk_{Guid.NewGuid():D}",
            Type: "risk",
            Version: 1,
            CreatedAt: now,
            CreatedBy: actor,
            UpdatedAt: now,
            OrgId: OrgId,
            RiskId: riskId,
            Title: title,
            Owner: owner,
            Likelihood: likelihood,
            Impact: impact,
            Score: likelihood * impact,
            Status: status,
            DueDate: dueDate,
            UpdatedBy: actor
        );

        db[riskId] = r;
        WriteDb(RisksPath, db);
        AppendRiskSnapshotEvent(actor, "risk.create", r);
        var ae = EmitAudit(actor, "human", "risk.create", $"risk:{riskId}", "success");
        return (r, ae);
    }

    public MvpRisk? GetRisk(string riskId)
    {
        var db = ReadDb<MvpRisk>(RisksPath);
        return db.TryGetValue(riskId, out var r) ? r : null;
    }

    public (MvpDecision decision, MvpAuditEvent audit) CreateDecision(string actor, string decisionId, string riskId, string decisionType, string rationale, string approvedBy, string? expiryDate)
    {
        var risk = GetRisk(riskId) ?? throw new InvalidOperationException($"Risk not found: {riskId}");

        if (decisionType == "accept" && string.IsNullOrWhiteSpace(expiryDate))
            throw new InvalidOperationException("expiryDate is required for accept");

        if (decisionType == "accept" && approvedBy == risk.Owner)
            throw new InvalidOperationException("SoD violation: owner cannot approve acceptance");

        var db = ReadDb<MvpDecision>(DecisionsPath);
        if (db.ContainsKey(decisionId)) throw new InvalidOperationException($"Decision already exists: {decisionId}");

        var now = NowIso();
        var d = new MvpDecision(
            Id: $"decision_{Guid.NewGuid():D}",
            Type: "decision",
            Version: 1,
            CreatedAt: now,
            CreatedBy: actor,
            OrgId: OrgId,
            DecisionId: decisionId,
            RiskId: riskId,
            DecisionType: decisionType,
            Rationale: rationale,
            ApprovedBy: approvedBy,
            ApprovedAt: now,
            ExpiryDate: expiryDate
        );

        db[decisionId] = d;
        WriteDb(DecisionsPath, db);
        var ae = EmitAudit(actor, "human", "risk.decision.create", $"decision:{decisionId}", "success");
        return (d, ae);
    }

    public List<MvpDecision> ListDecisionsByRisk(string riskId)
    {
        var db = ReadDb<MvpDecision>(DecisionsPath);
        return db.Values.Where(d => d.RiskId == riskId).ToList();
    }

    public (MvpCase c, MvpAuditEvent audit) CreateCase(string actor, string caseId, string riskId, string severity, string status, string owner)
    {
        var _ = GetRisk(riskId) ?? throw new InvalidOperationException($"Risk not found: {riskId}");

        var db = ReadDb<MvpCase>(CasesPath);
        if (db.ContainsKey(caseId)) throw new InvalidOperationException($"Case already exists: {caseId}");

        var now = NowIso();
        var c = new MvpCase(
            Id: $"case_{Guid.NewGuid():D}",
            Type: "case",
            Version: 1,
            CreatedAt: now,
            CreatedBy: actor,
            UpdatedAt: now,
            OrgId: OrgId,
            CaseId: caseId,
            Severity: severity,
            Status: status,
            Owner: owner,
            RiskRefs: new[] { riskId },
            UpdatedBy: actor
        );

        db[caseId] = c;
        WriteDb(CasesPath, db);
        AppendCaseSnapshotEvent(actor, "case.create", c);
        var ae = EmitAudit(actor, "human", "case.create", $"case:{caseId}", "success");
        return (c, ae);
    }

    public List<MvpAuditEvent> ListAuditByRequestId(string requestId)
    {
        if (!File.Exists(AuditPath)) return new();
        var lines = File.ReadAllLines(AuditPath, Encoding.UTF8)
            .Select(l => l.Trim())
            .Where(l => l.Length > 0)
            .Select(l => JsonSerializer.Deserialize<MvpAuditEvent>(l)!)
            .Where(a => a.RequestId == requestId)
            .ToList();
        return lines;
    }

    public static string Sha256File(string filePath)
    {
        using var sha = SHA256.Create();
        var bytes = File.ReadAllBytes(filePath);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
