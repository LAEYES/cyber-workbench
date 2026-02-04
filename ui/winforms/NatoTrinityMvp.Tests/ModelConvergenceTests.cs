using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using NatoTrinityMvp;
using Xunit;

public sealed class ModelConvergenceTests
{
    [Fact]
    public void WinForms_MvpStore_Emits_Schema_Aligned_Envelope_And_Field_Names()
    {
        var baseDir = Path.Combine(Path.GetTempPath(), "nato-mvp-tests", Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(baseDir);

        var store = new MvpStore(baseDir, "ORG_TEST");

        store.CreateRisk(
            actor: "tester",
            riskId: "R-1",
            title: "Test risk",
            owner: "alice",
            likelihood: 2,
            impact: 3,
            dueDate: "2030-01-01",
            status: "open"
        );

        store.CreateDecision(
            actor: "tester",
            decisionId: "D-1",
            riskId: "R-1",
            decisionType: "treat",
            rationale: "Because.",
            approvedBy: "bob",
            expiryDate: null
        );

        store.CreateCase(
            actor: "tester",
            caseId: "C-1",
            riskId: "R-1",
            severity: "high",
            status: "new",
            owner: "charlie"
        );

        var root = Path.Combine(Path.GetFullPath(baseDir), "nato-mvp-store", "ORG_TEST");

        // Risk
        var risksJson = File.ReadAllText(Path.Combine(root, "risks.json"), Encoding.UTF8);
        using (var doc = JsonDocument.Parse(risksJson))
        {
            var r = doc.RootElement.GetProperty("R-1");
            Assert.True(r.TryGetProperty("id", out _));
            Assert.Equal("risk", r.GetProperty("type").GetString());
            Assert.True(r.GetProperty("version").GetInt32() >= 1);
            Assert.True(r.TryGetProperty("createdAt", out _));
            Assert.Equal("tester", r.GetProperty("createdBy").GetString());
            Assert.Equal("R-1", r.GetProperty("riskId").GetString());
        }

        // Decision
        var decisionsJson = File.ReadAllText(Path.Combine(root, "decisions.json"), Encoding.UTF8);
        using (var doc = JsonDocument.Parse(decisionsJson))
        {
            var d = doc.RootElement.GetProperty("D-1");
            Assert.True(d.TryGetProperty("id", out _));
            Assert.Equal("decision", d.GetProperty("type").GetString());
            Assert.True(d.GetProperty("version").GetInt32() >= 1);
            Assert.Equal("D-1", d.GetProperty("decisionId").GetString());
            Assert.Equal("R-1", d.GetProperty("riskId").GetString());
        }

        // Case
        var casesJson = File.ReadAllText(Path.Combine(root, "cases.json"), Encoding.UTF8);
        using (var doc = JsonDocument.Parse(casesJson))
        {
            var c = doc.RootElement.GetProperty("C-1");
            Assert.True(c.TryGetProperty("id", out _));
            Assert.Equal("case", c.GetProperty("type").GetString());
            Assert.True(c.GetProperty("version").GetInt32() >= 1);
            Assert.Equal("C-1", c.GetProperty("caseId").GetString());

            Assert.True(c.TryGetProperty("riskRefs", out var rr));
            Assert.Equal(JsonValueKind.Array, rr.ValueKind);
            Assert.Contains(rr.EnumerateArray().Select(x => x.GetString()), x => x == "R-1");

            // Convergence check: avoid emitting the legacy singular riskId field.
            Assert.False(c.TryGetProperty("riskId", out _));
        }
    }
}
