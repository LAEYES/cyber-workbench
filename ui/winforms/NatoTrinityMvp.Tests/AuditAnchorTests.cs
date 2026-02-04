using System;
using System.IO;
using System.Text;
using System.Text.Json.Nodes;
using NatoTrinityMvp;
using Xunit;

public sealed class AuditAnchorTests
{
    [Fact]
    public void AuditAnchor_Verify_Signature_And_Drift_Detection_Work()
    {
        var baseDir = Path.Combine(Path.GetTempPath(), "nato-mvp-tests", Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(baseDir);

        var store = new MvpStore(baseDir, "ORG_TEST");

        // Create some state so heads are not GENESIS
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
        store.CreateCase(
            actor: "tester",
            caseId: "C-1",
            riskId: "R-1",
            severity: "high",
            status: "new",
            owner: "bob"
        );

        // Generate keys (PEM)
        var keyDir = Path.Combine(baseDir, "keys");
        MvpBundle.GenerateEd25519Keys(keyDir, "test", _ => { });
        var pubPath = Path.Combine(keyDir, "test.public.pem");
        var privPath = Path.Combine(keyDir, "test.private.pem");

        // Export signed anchor
        var anchorPath = store.ExportAuditAnchor("tester", privPath, "test-key");
        Assert.True(File.Exists(anchorPath));

        // Verify OK
        var ok = store.VerifyAuditAnchor("tester", anchorPath, pubPath);
        Assert.True(ok.ok, ok.details);

        // 1) Tamper payload (should fail hash)
        var node = JsonNode.Parse(File.ReadAllText(anchorPath, Encoding.UTF8))!.AsObject();
        node["riskHeadHash"] = "deadbeef";
        File.WriteAllText(anchorPath, node.ToJsonString() + "\n", Encoding.UTF8);
        var badHash = store.VerifyAuditAnchor("tester", anchorPath, pubPath);
        Assert.False(badHash.ok);
        Assert.Contains("ANCHOR_HASH_MISMATCH", badHash.details, StringComparison.OrdinalIgnoreCase);

        // Restore original anchor, then tamper signature value only (hash remains OK, signature fails)
        anchorPath = store.ExportAuditAnchor("tester", privPath, "test-key");
        var node2 = JsonNode.Parse(File.ReadAllText(anchorPath, Encoding.UTF8))!.AsObject();
        var sig = node2["signature"]!.AsObject();
        sig["value"] = Convert.ToBase64String(new byte[64]);
        File.WriteAllText(anchorPath, node2.ToJsonString() + "\n", Encoding.UTF8);
        var badSig = store.VerifyAuditAnchor("tester", anchorPath, pubPath);
        Assert.False(badSig.ok);
        Assert.Contains("SIGNATURE_INVALID", badSig.details, StringComparison.OrdinalIgnoreCase);

        // Drift detection: export fresh anchor, mutate store, verify should report drift
        anchorPath = store.ExportAuditAnchor("tester", privPath, "test-key");
        store.UpdateRiskStatus("tester", "R-1", "open");
        var drift = store.VerifyAuditAnchor("tester", anchorPath, pubPath);
        Assert.False(drift.ok);
        Assert.Contains("drift", drift.details, StringComparison.OrdinalIgnoreCase);
    }
}
