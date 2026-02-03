using System.Text.Json;

namespace NatoTrinityMvp;

public partial class Form1 : Form
{
    private string? _lastBundleDir;
    private string? _lastRiskRequestId;
    private string? _lastDecisionRequestId;
    private string? _lastCaseRequestId;

    public Form1()
    {
        InitializeComponent();
    }

    private MvpStore Store() => new(txtBaseDir.Text, txtOrg.Text);

    private void Log(string msg)
    {
        txtLog.AppendText(msg + Environment.NewLine);
    }

    private void SetLastRequestId(string kind, string requestId)
    {
        switch (kind)
        {
            case "risk":
                _lastRiskRequestId = requestId;
                txtLastRiskReq.Text = requestId;
                break;
            case "decision":
                _lastDecisionRequestId = requestId;
                txtLastDecisionReq.Text = requestId;
                break;
            case "case":
                _lastCaseRequestId = requestId;
                txtLastCaseReq.Text = requestId;
                break;
        }
    }

    private void OnCopyText(TextBox tb)
    {
        try
        {
            var txt = tb.Text;
            if (string.IsNullOrWhiteSpace(txt))
            {
                Log("Nothing to copy");
                return;
            }

            Clipboard.SetText(txt);
            Log("OK copied to clipboard");
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnOpenStoreDir()
    {
        try
        {
            var dir = Path.Combine(Path.GetFullPath(txtBaseDir.Text), "nato-mvp-store", txtOrg.Text);
            Directory.CreateDirectory(dir);
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = dir,
                UseShellExecute = true
            });
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnPickBaseDir()
    {
        using var dlg = new FolderBrowserDialog();
        dlg.SelectedPath = Path.GetFullPath(txtBaseDir.Text);
        if (dlg.ShowDialog(this) == DialogResult.OK)
        {
            txtBaseDir.Text = dlg.SelectedPath;
        }
    }

    private void OnPickBundleDir()
    {
        using var dlg = new FolderBrowserDialog();
        dlg.SelectedPath = Path.GetFullPath(txtBaseDir.Text);
        if (dlg.ShowDialog(this) == DialogResult.OK)
        {
            txtVerifyBundle.Text = dlg.SelectedPath;
        }
    }

    private void OnPickFile(TextBox target)
    {
        using var dlg = new OpenFileDialog();
        dlg.InitialDirectory = Path.GetFullPath(txtBaseDir.Text);
        if (dlg.ShowDialog(this) == DialogResult.OK)
        {
            target.Text = dlg.FileName;
        }
    }

    private void OnPickEvidenceFiles()
    {
        try
        {
            using var dlg = new OpenFileDialog();
            dlg.InitialDirectory = Path.GetFullPath(txtBaseDir.Text);
            dlg.Multiselect = true;
            dlg.Title = "Select evidence files";
            if (dlg.ShowDialog(this) != DialogResult.OK) return;

            txtEvidenceFiles.Text = string.Join(";", dlg.FileNames);
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnRiskCreate()
    {
        try
        {
            var (risk, ae) = Store().CreateRisk(
                actor: txtActor.Text,
                riskId: txtRiskId.Text,
                title: txtRiskTitle.Text,
                owner: txtRiskOwner.Text,
                likelihood: (int)numLikelihood.Value,
                impact: (int)numImpact.Value,
                dueDate: txtDue.Text
            );
            Log($"OK risk created {risk.RiskId} score={risk.Score}");
            Log($"OK auditEvent {ae.EventId} requestId={ae.RequestId}");
            SetLastRequestId("risk", ae.RequestId);
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnRiskGet()
    {
        try
        {
            var r = Store().GetRisk(txtRiskId.Text);
            if (r is null) { Log("Risk not found"); return; }
            Log(JsonSerializer.Serialize(r));
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnDecisionCreate()
    {
        try
        {
            var decisionId = $"D-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            var (d, ae) = Store().CreateDecision(
                actor: txtActor.Text,
                decisionId: decisionId,
                riskId: txtRiskId.Text,
                decisionType: txtDecisionType.Text.Trim(),
                rationale: txtDecisionRationale.Text,
                approvedBy: txtDecisionApprovedBy.Text,
                expiryDate: string.IsNullOrWhiteSpace(txtDecisionExpiry.Text) ? null : txtDecisionExpiry.Text
            );
            Log($"OK decision created {d.DecisionId} type={d.DecisionType} risk={d.RiskId}");
            Log($"OK auditEvent {ae.EventId} requestId={ae.RequestId}");
            SetLastRequestId("decision", ae.RequestId);
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnCaseCreate()
    {
        try
        {
            var (c, ae) = Store().CreateCase(
                actor: txtActor.Text,
                caseId: txtCaseId.Text,
                severity: cmbSeverity.SelectedItem?.ToString() ?? "high",
                status: cmbCaseStatus.SelectedItem?.ToString() ?? "new",
                owner: txtCaseOwner.Text
            );
            Log($"OK case created {c.CaseId}");
            Log($"OK auditEvent {ae.EventId} requestId={ae.RequestId}");
            SetLastRequestId("case", ae.RequestId);
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnCaseGet()
    {
        try
        {
            var root = Path.Combine(Path.GetFullPath(txtBaseDir.Text), "nato-mvp-store", txtOrg.Text, "cases.json");
            Log(File.Exists(root) ? File.ReadAllText(root) : "cases.json not found");
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnGenKeys()
    {
        try
        {
            var outDir = Path.Combine(Path.GetFullPath(txtBaseDir.Text), "nato-mvp-keys");
            MvpBundle.GenerateEd25519Keys(outDir, txtKeyId.Text.Trim(), Log);
            Log("NOTE: private key is base64 raw. Do not commit.");
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnBundleExport()
    {
        try
        {
            var files = txtEvidenceFiles.Text
                .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList();

            var outDir = Path.GetFullPath(txtBaseDir.Text);
            var sign = chkSign.Checked;
            var priv = string.IsNullOrWhiteSpace(txtPrivKey.Text) ? null : txtPrivKey.Text;
            var keyId = string.IsNullOrWhiteSpace(txtKeyId.Text) ? "demo" : txtKeyId.Text;

            _lastBundleDir = MvpBundle.ExportEvidencePackage(
                outDir: outDir,
                scopeRef: txtScopeRef.Text.Trim(),
                orgId: txtOrg.Text.Trim(),
                inputFiles: files,
                sign: sign,
                privateKeyPath: priv,
                keyId: keyId,
                log: Log
            );

            if (!string.IsNullOrWhiteSpace(_lastBundleDir))
            {
                txtVerifyBundle.Text = _lastBundleDir;
                tabsMain.SelectedTab = tabVerifyPage;
            }
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnVerifyManifest()
    {
        try
        {
            var bundleDir = txtVerifyBundle.Text.Trim();
            var pub = string.IsNullOrWhiteSpace(txtPubKey.Text) ? null : txtPubKey.Text;
            MvpBundle.VerifyManifestAndSignature(bundleDir, pub, Log);
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnVerifyHashes()
    {
        try
        {
            var bundleDir = txtVerifyBundle.Text.Trim();
            var manifest = Path.Combine(bundleDir, "manifest.json");
            MvpBundle.VerifyBundleHashes(manifest, Log);
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnOpenLastBundle()
    {
        try
        {
            var dir = _lastBundleDir;
            if (string.IsNullOrWhiteSpace(dir) || !Directory.Exists(dir))
            {
                Log("No bundle exported yet (or folder not found). Export first.");
                return;
            }

            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = dir,
                UseShellExecute = true
            });
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }
}
