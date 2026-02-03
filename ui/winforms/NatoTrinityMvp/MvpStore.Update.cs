namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    public (MvpRisk risk, MvpAuditEvent audit) UpdateRiskStatus(string actor, string riskId, string newStatus)
    {
        var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "open",
            "mitigating",
            "accepted",
            "closed"
        };
        if (!allowed.Contains(newStatus)) throw new InvalidOperationException($"Invalid risk status: {newStatus}");

        var db = ReadDb<MvpRisk>(RisksPath);
        if (!db.TryGetValue(riskId, out var r)) throw new InvalidOperationException($"Risk not found: {riskId}");

        var updated = r with { Status = newStatus, UpdatedAt = NowIso(), UpdatedBy = actor };
        db[riskId] = updated;
        WriteDb(RisksPath, db);

        var ae = EmitAudit(actor, "human", "risk.updateStatus", $"risk:{riskId}", "success");
        return (updated, ae);
    }
}
