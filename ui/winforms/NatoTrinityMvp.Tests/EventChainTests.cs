using System;
using System.IO;
using System.Text;
using System.Text.Json.Nodes;
using NatoTrinityMvp;
using Xunit;

public sealed class EventChainTests
{
    [Fact]
    public void RiskEvents_HashChain_DetectsTampering()
    {
        var baseDir = Path.Combine(Path.GetTempPath(), "nato-mvp-tests", Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(baseDir);

        var store = new MvpStore(baseDir, "ORG_TEST");

        // create a risk (writes a chained event)
        store.CreateRisk(
            actor: "tester",
            riskId: "R-1",
            title: "Test risk",
            owner: "alice",
            likelihood: 3,
            impact: 4,
            dueDate: "2030-01-01",
            status: "new"
        );

        var ok0 = store.VerifyEntityEventsDetailed();
        Assert.True(ok0.ok, ok0.details);

        // Tamper with first line
        var riskEventsPath = Path.Combine(baseDir, "nato-mvp-store", "ORG_TEST", "riskEvents.jsonl");
        var lines = File.ReadAllLines(riskEventsPath, Encoding.UTF8);
        Assert.NotEmpty(lines);

        var obj = JsonNode.Parse(lines[0])!.AsObject();
        obj["action"] = "risk.create.TAMPERED";
        lines[0] = obj.ToJsonString();
        File.WriteAllLines(riskEventsPath, lines, Encoding.UTF8);

        var ok1 = store.VerifyEntityEventsDetailed();
        Assert.False(ok1.ok);
        Assert.Contains("hash mismatch", ok1.details, StringComparison.OrdinalIgnoreCase);
    }
}
