namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    public void LinkRiskToCase(string actor, string caseId, string riskId)
    {
        var _ = GetRisk(riskId) ?? throw new InvalidOperationException($"Risk not found: {riskId}");

        var cdb = ReadDb<MvpCase>(CasesPath);
        if (!cdb.TryGetValue(caseId, out var c)) throw new InvalidOperationException($"Case not found: {caseId}");

        var refs = (c.RiskRefs ?? Array.Empty<string>()).ToList();
        if (!refs.Contains(riskId, StringComparer.OrdinalIgnoreCase)) refs.Add(riskId);

        var updated = c with
        {
            RiskRefs = refs.ToArray(),
            UpdatedAt = NowIso(),
            UpdatedBy = actor,
            Version = Math.Max(1, c.Version) + 1
        };

        cdb[caseId] = updated;
        WriteDb(CasesPath, cdb);
        AppendCaseSnapshotEvent(actor, "case.linkRisk", updated);
        EmitAudit(actor, "human", "case.linkRisk", $"case:{caseId}", "success");
    }
}
