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
        UpdateRiskScore();
        RefreshEventHeads();

        txtRiskId.TextChanged += (_, _) =>
        {
            if (string.IsNullOrWhiteSpace(txtCaseRiskId.Text))
                txtCaseRiskId.Text = txtRiskId.Text;
        };
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

    private void RefreshEventHeads()
    {
        try
        {
            var (riskHead, caseHead) = Store().GetEventHeadHashes();
            txtRiskHeadHash.Text = riskHead;
            txtCaseHeadHash.Text = caseHead;
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnRefreshEventHeads() => RefreshEventHeads();

    private void UpdateRiskScore()
    {
        var score = (int)numLikelihood.Value * (int)numImpact.Value;
        lblRiskScore.Text = $"Score: {score}";
    }

    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static bool IsIsoDate(string s) => DateTime.TryParse(s, out _);

    private static bool IsId(string id, string prefix) =>
        !string.IsNullOrWhiteSpace(id) && id.StartsWith(prefix, StringComparison.OrdinalIgnoreCase);

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

    private void OnRebuildFromEvents()
    {
        try
        {
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");
            var (risks, cases) = Store().RebuildProjectionsFromEvents(txtActor.Text, verifyFirst: true);
            Log($"OK rebuilt projections from events (verified): risks={risks} cases={cases}");
            RefreshEventHeads();
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnVerifyEvents()
    {
        try
        {
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");
            var (total, legacy, verified) = Store().VerifyEntityEvents(txtActor.Text);
            Log($"OK events verification: total={total} verified={verified} legacy={legacy}");
            RefreshEventHeads();
            if (legacy > 0)
                Log("WARN legacy events detected (no hash/prevHash) - use Migrate legacy to chain everything");
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnMigrateLegacyEvents()
    {
        try
        {
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");

            var answer = MessageBox.Show(
                this,
                "This will rewrite riskEvents.jsonl and caseEvents.jsonl into a fully chained tamper-evident log.\n\nA .bak.<timestamp> backup will be created next to each file.\n\nContinue?",
                "Migrate legacy events",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning
            );
            if (answer != DialogResult.Yes) return;

            var (total, migrated) = Store().MigrateLegacyToChained(txtActor.Text);
            Log($"OK migrated events to chained format: migrated={migrated} total={total}");

            // Verify after migration
            var (t2, legacy2, verified2) = Store().VerifyEntityEvents(txtActor.Text);
            Log($"OK post-migration verify: total={t2} verified={verified2} legacy={legacy2}");
            RefreshEventHeads();
        }
        catch (Exception ex)
        {
            Log("ERROR " + ex.Message);
        }
    }

    private void OnExportAuditAnchor()
    {
        try
        {
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");

            // Reuse bundle signing key fields (if provided)
            var keyId = string.IsNullOrWhiteSpace(txtKeyId.Text) ? "ui" : txtKeyId.Text.Trim();
            var priv = string.IsNullOrWhiteSpace(txtPrivKey.Text) ? null : txtPrivKey.Text.Trim();

            var path = Store().ExportAuditAnchor(txtActor.Text, priv, keyId);
            Log($"OK audit anchor exported: {path}");

            RefreshEventHeads();
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
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");
            Require(IsId(txtRiskId.Text, "R-"), "RiskId must start with R- (e.g., R-123)");
            Require(!string.IsNullOrWhiteSpace(txtRiskTitle.Text), "Title is required");
            Require(!string.IsNullOrWhiteSpace(txtRiskOwner.Text), "Owner is required");
            Require(IsIsoDate(txtDue.Text), "Due date must be a valid date (ISO recommended: YYYY-MM-DD)");

            var (risk, ae) = Store().CreateRisk(
                actor: txtActor.Text,
                riskId: txtRiskId.Text,
                title: txtRiskTitle.Text,
                owner: txtRiskOwner.Text,
                likelihood: (int)numLikelihood.Value,
                impact: (int)numImpact.Value,
                dueDate: txtDue.Text,
                status: cmbRiskStatus.SelectedItem?.ToString() ?? "open"
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

            txtRiskTitle.Text = r.Title;
            txtRiskOwner.Text = r.Owner;
            numLikelihood.Value = r.Likelihood;
            numImpact.Value = r.Impact;
            txtDue.Text = r.DueDate;
            var idx = cmbRiskStatus.Items.IndexOf(r.Status);
            if (idx >= 0) cmbRiskStatus.SelectedIndex = idx;
            UpdateRiskScore();

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
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");
            Require(IsId(txtRiskId.Text, "R-"), "RiskId must start with R-");
            var dt = txtDecisionType.Text.Trim();
            Require(!string.IsNullOrWhiteSpace(dt), "Decision type is required");
            Require(!string.IsNullOrWhiteSpace(txtDecisionApprovedBy.Text), "ApprovedBy is required");
            Require(!string.IsNullOrWhiteSpace(txtDecisionRationale.Text), "Rationale is required");

            string? expiry = string.IsNullOrWhiteSpace(txtDecisionExpiry.Text) ? null : txtDecisionExpiry.Text.Trim();
            if (string.Equals(dt, "accept", StringComparison.OrdinalIgnoreCase))
            {
                Require(expiry is not null, "Expiry is required for accept");
                Require(DateTime.TryParse(expiry, out var exp), "Expiry must be a valid date");
                Require(exp.Date > DateTime.Today, "Expiry must be > today");
            }
            else if (expiry is not null)
            {
                Require(IsIsoDate(expiry), "Expiry must be a valid date");
            }

            var decisionId = $"D-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            var (d, ae) = Store().CreateDecision(
                actor: txtActor.Text,
                decisionId: decisionId,
                riskId: txtRiskId.Text,
                decisionType: dt,
                rationale: txtDecisionRationale.Text,
                approvedBy: txtDecisionApprovedBy.Text,
                expiryDate: expiry
            );
            Log($"OK decision created {d.DecisionId} type={d.DecisionType} risk={d.RiskId}");
            Log($"OK auditEvent {ae.EventId} requestId={ae.RequestId}");
            SetLastRequestId("decision", ae.RequestId);

            // Best-effort status propagation
            var normalized = dt.ToLowerInvariant();
            var status = normalized switch
            {
                "accept" => "accepted",
                "mitigate" => "mitigating",
                "close" => "closed",
                _ => null
            };
            if (status is not null)
            {
                var (r2, ae2) = Store().UpdateRiskStatus(txtActor.Text, txtRiskId.Text, status);
                Log($"OK risk status -> {r2.Status} (audit requestId={ae2.RequestId})");
                SetLastRequestId("risk", ae2.RequestId);
            }
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
            Require(!string.IsNullOrWhiteSpace(txtActor.Text), "Actor is required");
            Require(IsId(txtCaseId.Text, "C-"), "CaseId must start with C- (e.g., C-123)");
            Require(IsId(txtCaseRiskId.Text, "R-"), "Case RiskId must start with R-");
            Require(!string.IsNullOrWhiteSpace(txtCaseOwner.Text), "Owner is required");

            var (c, ae) = Store().CreateCase(
                actor: txtActor.Text,
                caseId: txtCaseId.Text,
                riskId: txtCaseRiskId.Text,
                severity: cmbSeverity.SelectedItem?.ToString() ?? "high",
                status: cmbCaseStatus.SelectedItem?.ToString() ?? "triage",
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
