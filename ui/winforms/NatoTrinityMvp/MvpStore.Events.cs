using System.Text;
using System.Text.Json;

namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    private string RiskEventsPath => Path.Combine(RootDir, "riskEvents.jsonl");
    private string CaseEventsPath => Path.Combine(RootDir, "caseEvents.jsonl");

    private void AppendEntityEvent(string filePath, object ev)
    {
        EnsureDir(RootDir);
        File.AppendAllText(filePath, JsonSerializer.Serialize(ev) + "\n", Encoding.UTF8);
    }

    private void AppendRiskSnapshotEvent(string actor, string action, MvpRisk risk)
    {
        var ev = new
        {
            eventId = NewId("re"),
            orgId = OrgId,
            entityType = "risk",
            entityId = risk.RiskId,
            action,
            actor,
            timestamp = NowIso(),
            snapshot = risk
        };
        AppendEntityEvent(RiskEventsPath, ev);
    }

    private void AppendCaseSnapshotEvent(string actor, string action, MvpCase c)
    {
        var ev = new
        {
            eventId = NewId("ce"),
            orgId = OrgId,
            entityType = "case",
            entityId = c.CaseId,
            action,
            actor,
            timestamp = NowIso(),
            snapshot = c
        };
        AppendEntityEvent(CaseEventsPath, ev);
    }

    public (int risks, int cases) RebuildProjectionsFromEvents(string actor)
    {
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
                var r = snap.Deserialize<MvpRisk>();
                if (r is null) continue;
                risks[r.RiskId] = r;
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
                var c = snap.Deserialize<MvpCase>();
                if (c is null) continue;
                cases[c.CaseId] = c;
            }
        }

        WriteDb(RisksPath, risks);
        WriteDb(CasesPath, cases);

        EmitAudit(actor, "human", "store.rebuildFromEvents", $"store:{OrgId}", "success");

        return (risks.Count, cases.Count);
    }
}
