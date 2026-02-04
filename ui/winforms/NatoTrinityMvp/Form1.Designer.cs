#nullable enable
using System.Drawing;

namespace NatoTrinityMvp;

partial class Form1
{
    private System.ComponentModel.IContainer? components = null;

    private TextBox txtBaseDir = null!;
    private TextBox txtOrg = null!;
    private TextBox txtActor = null!;
    private TextBox txtLog = null!;

    private TextBox txtRiskId = null!;
    private TextBox txtRiskTitle = null!;
    private TextBox txtRiskOwner = null!;
    private NumericUpDown numLikelihood = null!;
    private NumericUpDown numImpact = null!;
    private TextBox txtDue = null!;
    private ComboBox cmbRiskStatus = null!;
    private Label lblRiskScore = null!;

    private TextBox txtDecisionType = null!;
    private TextBox txtDecisionRationale = null!;
    private TextBox txtDecisionApprovedBy = null!;
    private TextBox txtDecisionExpiry = null!;

    private TextBox txtCaseId = null!;
    private TextBox txtCaseRiskId = null!;
    private ComboBox cmbSeverity = null!;
    private ComboBox cmbCaseStatus = null!;
    private TextBox txtCaseOwner = null!;

    // Evidence (store)
    private TextBox txtEvidenceInFile = null!;
    private TextBox txtEvidenceId = null!;
    private ComboBox cmbEvidenceType = null!;
    private TextBox txtEvidenceSource = null!;
    private TextBox txtEvidenceCollector = null!;
    private ComboBox cmbEvidenceClassification = null!;
    private ComboBox cmbEvidenceRetention = null!;
    private TextBox txtStoreExportScope = null!;

    private TextBox txtScopeRef = null!;
    private TextBox txtEvidenceFiles = null!;
    private CheckBox chkSign = null!;
    private TextBox txtPrivKey = null!;
    private TextBox txtPubKey = null!;
    private TextBox txtKeyId = null!;

    private TextBox txtVerifyBundle = null!;

    private TabControl tabsMain = null!;
    private TabPage tabVerifyPage = null!;
    private SplitContainer splitMain = null!;

    private TextBox txtLastRiskReq = null!;
    private TextBox txtLastDecisionReq = null!;
    private TextBox txtLastCaseReq = null!;

    private TextBox txtRiskHeadHash = null!;
    private TextBox txtCaseHeadHash = null!;

    private Label lblToolStatus = null!;
    private Label lblToolLastVerified = null!;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        this.Text = "NATO Trinity MVP";
        this.ClientSize = new Size(1200, 760);
        this.MinimumSize = new Size(980, 640);
        this.StartPosition = FormStartPosition.CenterScreen;
        this.BackColor = Color.FromArgb(245, 247, 250);
        this.Font = new Font("Bahnschrift", 9.5f, FontStyle.Regular, GraphicsUnit.Point);
        this.ForeColor = Color.FromArgb(32, 37, 44);

        var accent = Color.FromArgb(25, 90, 165);
        var accentSoft = Color.FromArgb(226, 236, 248);
        var surface = Color.White;
        var subtleText = Color.FromArgb(88, 96, 105);

        Label MakeLabel(string text)
        {
            return new Label
            {
                Text = text,
                AutoSize = true,
                ForeColor = subtleText,
                TextAlign = ContentAlignment.MiddleLeft,
                Margin = new Padding(3, 8, 3, 4)
            };
        }

        TextBox MakeTextBox(string text)
        {
            return new TextBox
            {
                Text = text,
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.White,
                Dock = DockStyle.Fill,
                Margin = new Padding(3, 4, 12, 4)
            };
        }

        void StylePrimary(Button b)
        {
            b.AutoSize = true;
            b.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            b.BackColor = accent;
            b.ForeColor = Color.White;
            b.FlatStyle = FlatStyle.Flat;
            b.FlatAppearance.BorderSize = 0;
            b.Padding = new Padding(10, 6, 10, 6);
            b.Margin = new Padding(0, 0, 8, 0);
        }

        void StyleSecondary(Button b)
        {
            b.AutoSize = true;
            b.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            b.BackColor = accentSoft;
            b.ForeColor = accent;
            b.FlatStyle = FlatStyle.Flat;
            b.FlatAppearance.BorderColor = accent;
            b.FlatAppearance.BorderSize = 1;
            b.Padding = new Padding(10, 6, 10, 6);
            b.Margin = new Padding(0, 0, 8, 0);
        }

        void StyleCombo(ComboBox c)
        {
            c.FlatStyle = FlatStyle.Flat;
            c.BackColor = Color.White;
            c.Margin = new Padding(3, 4, 12, 4);
            c.Dock = DockStyle.Fill;
        }

        void StyleNumber(NumericUpDown n)
        {
            n.BackColor = Color.White;
            n.Margin = new Padding(3, 4, 12, 4);
            n.Dock = DockStyle.Fill;
        }

        GroupBox MakeGroup(string text)
        {
            return new GroupBox
            {
                Text = text,
                Dock = DockStyle.Top,
                AutoSize = true,
                AutoSizeMode = AutoSizeMode.GrowAndShrink,
                BackColor = surface,
                ForeColor = this.ForeColor,
                Padding = new Padding(12, 24, 12, 12),
                Margin = new Padding(0, 0, 0, 12)
            };
        }

        tabsMain = new TabControl { Dock = DockStyle.Fill };
        var tabStore = new TabPage("Store") { Padding = new Padding(8), BackColor = this.BackColor, AutoScroll = true };
        var tabBundle = new TabPage("Bundles") { Padding = new Padding(8), BackColor = this.BackColor, AutoScroll = true };
        tabVerifyPage = new TabPage("Verify") { Padding = new Padding(8), BackColor = this.BackColor, AutoScroll = true };

        tabsMain.TabPages.Add(tabStore);
        tabsMain.TabPages.Add(tabBundle);
        tabsMain.TabPages.Add(tabVerifyPage);

        var headerCard = new Panel
        {
            Dock = DockStyle.Top,
            Height = 96,
            Padding = new Padding(12),
            BackColor = surface,
            BorderStyle = BorderStyle.FixedSingle
        };

        var headerLayout = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 1, RowCount = 2 };
        headerLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 55));
        headerLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 45));

        var baseRow = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 4 };
        baseRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        baseRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        baseRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        baseRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        var lblBase = MakeLabel("Base dir");
        txtBaseDir = MakeTextBox("..\\..\\..\\..\\deliverables-demo");
        var btnPickBase = new Button { Text = "Browse" };
        StyleSecondary(btnPickBase);
        btnPickBase.Click += (_, _) => OnPickBaseDir();

        var btnOpenStore = new Button { Text = "Open store" };
        StyleSecondary(btnOpenStore);
        btnOpenStore.Click += (_, _) => OnOpenStoreDir();

        var btnRebuild = new Button { Text = "Rebuild" };
        StyleSecondary(btnRebuild);
        btnRebuild.Click += (_, _) => OnRebuildFromEvents();

        var btnVerifyEvents = new Button { Text = "Verify events" };
        StyleSecondary(btnVerifyEvents);
        btnVerifyEvents.Click += (_, _) => OnVerifyEvents();

        var btnMigrateEvents = new Button { Text = "Migrate legacy" };
        StyleSecondary(btnMigrateEvents);
        btnMigrateEvents.Click += (_, _) => OnMigrateLegacyEvents();

        var btnExportAnchor = new Button { Text = "Export anchor" };
        StyleSecondary(btnExportAnchor);
        btnExportAnchor.Click += (_, _) => OnExportAuditAnchor();

        var baseButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Fill,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = false
        };
        baseButtons.Controls.Add(btnPickBase);
        baseButtons.Controls.Add(btnOpenStore);
        baseButtons.Controls.Add(btnVerifyEvents);
        baseButtons.Controls.Add(btnMigrateEvents);
        baseButtons.Controls.Add(btnRebuild);
        baseButtons.Controls.Add(btnExportAnchor);

        baseRow.Controls.Add(lblBase, 0, 0);
        baseRow.Controls.Add(txtBaseDir, 1, 0);
        baseRow.Controls.Add(baseButtons, 2, 0);
        baseRow.SetColumnSpan(baseButtons, 2);

        var orgRow = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 4 };
        orgRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        orgRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50));
        orgRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        orgRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50));

        var lblOrg = MakeLabel("OrgId");
        txtOrg = MakeTextBox("ACME");
        var lblActor = MakeLabel("Actor");
        txtActor = MakeTextBox("bob");

        orgRow.Controls.Add(lblOrg, 0, 0);
        orgRow.Controls.Add(txtOrg, 1, 0);
        orgRow.Controls.Add(lblActor, 2, 0);
        orgRow.Controls.Add(txtActor, 3, 0);

        headerLayout.Controls.Add(baseRow, 0, 0);
        headerLayout.Controls.Add(orgRow, 0, 1);
        headerCard.Controls.Add(headerLayout);

        var logCard = new Panel
        {
            Dock = DockStyle.Bottom,
            Height = 200,
            Padding = new Padding(12),
            BackColor = surface,
            BorderStyle = BorderStyle.FixedSingle
        };

        var logLayout = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, RowCount = 2 };
        logLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        logLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        logLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        logLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        var lblLog = new Label
        {
            Text = "Activity log",
            AutoSize = true,
            ForeColor = subtleText,
            Margin = new Padding(3, 0, 3, 6)
        };

        txtLog = new TextBox
        {
            Dock = DockStyle.Fill,
            Multiline = true,
            ScrollBars = ScrollBars.Both,
            ReadOnly = true,
            WordWrap = false,
            BorderStyle = BorderStyle.FixedSingle,
            BackColor = Color.White,
            Font = new Font("Consolas", 9f)
        };

        var logButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Fill,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = false,
            Anchor = AnchorStyles.Right
        };

        var btnClearLog = new Button { Text = "Clear" };
        StyleSecondary(btnClearLog);
        btnClearLog.Click += (_, _) => txtLog.Clear();

        var btnCopyLog = new Button { Text = "Copy" };
        StyleSecondary(btnCopyLog);
        btnCopyLog.Click += (_, _) =>
        {
            try
            {
                Clipboard.SetText(txtLog.Text);
                Log("OK log copied to clipboard");
            }
            catch (Exception ex)
            {
                Log("ERROR " + ex.Message);
            }
        };

        logButtons.Controls.Add(btnClearLog);
        logButtons.Controls.Add(btnCopyLog);

        logLayout.Controls.Add(lblLog, 0, 0);
        logLayout.Controls.Add(logButtons, 1, 0);
        logLayout.Controls.Add(txtLog, 0, 1);
        logLayout.SetColumnSpan(txtLog, 2);
        logCard.Controls.Add(logLayout);

        var storeLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            ColumnCount = 1
        };
        storeLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var grpLast = MakeGroup("Last requestIds");
        var lastLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        lastLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        lastLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        lastLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtLastRiskReq = MakeTextBox("");
        txtLastRiskReq.ReadOnly = true;
        txtLastDecisionReq = MakeTextBox("");
        txtLastDecisionReq.ReadOnly = true;
        txtLastCaseReq = MakeTextBox("");
        txtLastCaseReq.ReadOnly = true;

        var btnCopyRiskReq = new Button { Text = "Copy" };
        StyleSecondary(btnCopyRiskReq);
        btnCopyRiskReq.Click += (_, _) => OnCopyText(txtLastRiskReq);

        var btnCopyDecisionReq = new Button { Text = "Copy" };
        StyleSecondary(btnCopyDecisionReq);
        btnCopyDecisionReq.Click += (_, _) => OnCopyText(txtLastDecisionReq);

        var btnCopyCaseReq = new Button { Text = "Copy" };
        StyleSecondary(btnCopyCaseReq);
        btnCopyCaseReq.Click += (_, _) => OnCopyText(txtLastCaseReq);

        lastLayout.Controls.Add(MakeLabel("Risk"), 0, 0);
        lastLayout.Controls.Add(txtLastRiskReq, 1, 0);
        lastLayout.Controls.Add(btnCopyRiskReq, 2, 0);

        lastLayout.Controls.Add(MakeLabel("Decision"), 0, 1);
        lastLayout.Controls.Add(txtLastDecisionReq, 1, 1);
        lastLayout.Controls.Add(btnCopyDecisionReq, 2, 1);

        lastLayout.Controls.Add(MakeLabel("Case"), 0, 2);
        lastLayout.Controls.Add(txtLastCaseReq, 1, 2);
        lastLayout.Controls.Add(btnCopyCaseReq, 2, 2);

        grpLast.Controls.Add(lastLayout);

        var grpHeads = MakeGroup("Event heads (hash)" );
        var headsLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        headsLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        headsLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        headsLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtRiskHeadHash = MakeTextBox("GENESIS");
        txtRiskHeadHash.ReadOnly = true;
        txtCaseHeadHash = MakeTextBox("GENESIS");
        txtCaseHeadHash.ReadOnly = true;

        var btnCopyRiskHead = new Button { Text = "Copy" };
        StyleSecondary(btnCopyRiskHead);
        btnCopyRiskHead.Click += (_, _) => OnCopyText(txtRiskHeadHash);

        var btnCopyCaseHead = new Button { Text = "Copy" };
        StyleSecondary(btnCopyCaseHead);
        btnCopyCaseHead.Click += (_, _) => OnCopyText(txtCaseHeadHash);

        var btnRefreshHeads = new Button { Text = "Refresh" };
        StyleSecondary(btnRefreshHeads);
        btnRefreshHeads.Click += (_, _) => OnRefreshEventHeads();

        headsLayout.Controls.Add(MakeLabel("Risk"), 0, 0);
        headsLayout.Controls.Add(txtRiskHeadHash, 1, 0);
        headsLayout.Controls.Add(btnCopyRiskHead, 2, 0);

        headsLayout.Controls.Add(MakeLabel("Case"), 0, 1);
        headsLayout.Controls.Add(txtCaseHeadHash, 1, 1);
        headsLayout.Controls.Add(btnCopyCaseHead, 2, 1);

        headsLayout.Controls.Add(new Label { Text = "", AutoSize = true }, 0, 2);
        headsLayout.Controls.Add(btnRefreshHeads, 1, 2);

        grpHeads.Controls.Add(headsLayout);

        var grpRisk = MakeGroup("Risk");
        var riskLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };
        var riskActions = new FlowLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = true,
            Margin = new Padding(0, 0, 0, 8)
        };

        var btnRiskCreate = new Button { Text = "Create Risk" };
        StylePrimary(btnRiskCreate);
        btnRiskCreate.Click += (_, _) => OnRiskCreate();
        var btnRiskGet = new Button { Text = "Get Risk" };
        StyleSecondary(btnRiskGet);
        btnRiskGet.Click += (_, _) => OnRiskGet();

        riskActions.Controls.Add(btnRiskCreate);
        riskActions.Controls.Add(btnRiskGet);

        var riskFields = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 6 };
        riskFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        riskFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 34));
        riskFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        riskFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));
        riskFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        riskFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));

        txtRiskId = MakeTextBox("R-TEST");
        txtRiskTitle = MakeTextBox("Test risk");
        txtRiskOwner = MakeTextBox("alice");
        numLikelihood = new NumericUpDown { Minimum = 1, Maximum = 5, Value = 3 };
        StyleNumber(numLikelihood);
        numImpact = new NumericUpDown { Minimum = 1, Maximum = 5, Value = 4 };
        StyleNumber(numImpact);
        txtDue = MakeTextBox("2026-03-01");

        cmbRiskStatus = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList };
        cmbRiskStatus.Items.AddRange(new object[] { "new", "open", "accepted", "mitigated", "closed" });
        cmbRiskStatus.SelectedIndex = 1;
        StyleCombo(cmbRiskStatus);

        lblRiskScore = new Label
        {
            AutoSize = true,
            Text = "Score: 12",
            ForeColor = subtleText,
            Margin = new Padding(3, 8, 12, 4)
        };

        numLikelihood.ValueChanged += (_, _) => UpdateRiskScore();
        numImpact.ValueChanged += (_, _) => UpdateRiskScore();

        riskFields.Controls.Add(MakeLabel("RiskId"), 0, 0);
        riskFields.Controls.Add(txtRiskId, 1, 0);
        riskFields.Controls.Add(MakeLabel("Title"), 2, 0);
        riskFields.Controls.Add(txtRiskTitle, 3, 0);
        riskFields.Controls.Add(MakeLabel("Owner"), 4, 0);
        riskFields.Controls.Add(txtRiskOwner, 5, 0);

        riskFields.Controls.Add(MakeLabel("Likelihood"), 0, 1);
        riskFields.Controls.Add(numLikelihood, 1, 1);
        riskFields.Controls.Add(MakeLabel("Impact"), 2, 1);
        riskFields.Controls.Add(numImpact, 3, 1);
        riskFields.Controls.Add(MakeLabel("Due"), 4, 1);
        riskFields.Controls.Add(txtDue, 5, 1);

        riskFields.Controls.Add(MakeLabel("Status"), 0, 2);
        riskFields.Controls.Add(cmbRiskStatus, 1, 2);
        riskFields.Controls.Add(lblRiskScore, 2, 2);
        riskFields.SetColumnSpan(lblRiskScore, 4);

        riskLayout.Controls.Add(riskActions, 0, 0);
        riskLayout.Controls.Add(riskFields, 0, 1);
        grpRisk.Controls.Add(riskLayout);

        var grpDecision = MakeGroup("Decision");
        var decisionLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };

        var decisionActions = new FlowLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = true,
            Margin = new Padding(0, 0, 0, 8)
        };

        var btnDecisionCreate = new Button { Text = "Create Decision" };
        StylePrimary(btnDecisionCreate);
        btnDecisionCreate.Click += (_, _) => OnDecisionCreate();
        decisionActions.Controls.Add(btnDecisionCreate);

        var decisionFields = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 6 };
        decisionFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 34));
        decisionFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));
        decisionFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));

        txtDecisionType = MakeTextBox("accept");
        txtDecisionApprovedBy = MakeTextBox("ciso");
        txtDecisionExpiry = MakeTextBox("2026-04-01");
        txtDecisionRationale = MakeTextBox("Business need");
        txtDecisionRationale.Margin = new Padding(3, 4, 12, 8);

        decisionFields.Controls.Add(MakeLabel("Type"), 0, 0);
        decisionFields.Controls.Add(txtDecisionType, 1, 0);
        decisionFields.Controls.Add(MakeLabel("Approved by"), 2, 0);
        decisionFields.Controls.Add(txtDecisionApprovedBy, 3, 0);
        decisionFields.Controls.Add(MakeLabel("Expiry"), 4, 0);
        decisionFields.Controls.Add(txtDecisionExpiry, 5, 0);

        decisionFields.Controls.Add(MakeLabel("Rationale"), 0, 1);
        decisionFields.Controls.Add(txtDecisionRationale, 1, 1);
        decisionFields.SetColumnSpan(txtDecisionRationale, 5);

        decisionLayout.Controls.Add(decisionActions, 0, 0);
        decisionLayout.Controls.Add(decisionFields, 0, 1);
        grpDecision.Controls.Add(decisionLayout);

        var grpCase = MakeGroup("Case");
        var caseLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };
        var caseActions = new FlowLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = true,
            Margin = new Padding(0, 0, 0, 8)
        };

        var btnCaseCreate = new Button { Text = "Create Case" };
        StylePrimary(btnCaseCreate);
        btnCaseCreate.Click += (_, _) => OnCaseCreate();
        var btnCaseGet = new Button { Text = "Get Case" };
        StyleSecondary(btnCaseGet);
        btnCaseGet.Click += (_, _) => OnCaseGet();

        caseActions.Controls.Add(btnCaseCreate);
        caseActions.Controls.Add(btnCaseGet);

        var btnCaseLinkRisk = new Button { Text = "Link Risk" };
        StyleSecondary(btnCaseLinkRisk);
        btnCaseLinkRisk.Click += (_, _) => OnCaseLinkRisk();
        caseActions.Controls.Add(btnCaseLinkRisk);

        var caseFields = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 6 };
        caseFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 34));
        caseFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));
        caseFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));

        txtCaseId = MakeTextBox("C-TEST");
        cmbSeverity = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList };
        cmbSeverity.Items.AddRange(new object[] { "low", "medium", "high", "critical" });
        cmbSeverity.SelectedIndex = 2;
        StyleCombo(cmbSeverity);

        cmbCaseStatus = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList };
        cmbCaseStatus.Items.AddRange(new object[] { "new", "triage", "investigate", "contain", "eradicate", "recover", "closed" });
        cmbCaseStatus.SelectedIndex = 1;
        StyleCombo(cmbCaseStatus);

        txtCaseOwner = MakeTextBox("soclead");
        txtCaseRiskId = MakeTextBox("R-TEST");

        caseFields.Controls.Add(MakeLabel("CaseId"), 0, 0);
        caseFields.Controls.Add(txtCaseId, 1, 0);
        caseFields.Controls.Add(MakeLabel("Severity"), 2, 0);
        caseFields.Controls.Add(cmbSeverity, 3, 0);
        caseFields.Controls.Add(MakeLabel("Status"), 4, 0);
        caseFields.Controls.Add(cmbCaseStatus, 5, 0);

        caseFields.Controls.Add(MakeLabel("Owner"), 0, 1);
        caseFields.Controls.Add(txtCaseOwner, 1, 1);
        caseFields.Controls.Add(MakeLabel("RiskId"), 2, 1);
        caseFields.Controls.Add(txtCaseRiskId, 3, 1);
        caseFields.SetColumnSpan(txtCaseOwner, 1);
        caseFields.SetColumnSpan(txtCaseRiskId, 3);

        caseLayout.Controls.Add(caseActions, 0, 0);
        caseLayout.Controls.Add(caseFields, 0, 1);
        grpCase.Controls.Add(caseLayout);

        // Evidence (store)
        var grpEvidence = MakeGroup("Evidence (store)");
        var evidenceLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };

        var evidencePickRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        evidencePickRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        evidencePickRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        evidencePickRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtEvidenceInFile = MakeTextBox("");
        var btnPickEvidenceIn = new Button { Text = "Browse" };
        StyleSecondary(btnPickEvidenceIn);
        btnPickEvidenceIn.Click += (_, _) => OnPickFile(txtEvidenceInFile);

        evidencePickRow.Controls.Add(MakeLabel("File"), 0, 0);
        evidencePickRow.Controls.Add(txtEvidenceInFile, 1, 0);
        evidencePickRow.Controls.Add(btnPickEvidenceIn, 2, 0);

        var evidenceFields = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 6 };
        evidenceFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        evidenceFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 34));
        evidenceFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        evidenceFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));
        evidenceFields.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        evidenceFields.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33));

        txtEvidenceId = MakeTextBox("EV-1");
        cmbEvidenceType = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList };
        cmbEvidenceType.Items.AddRange(new object[] { "logExport", "configSnapshot", "ticket", "report", "sbom", "vex", "attestation", "signature", "screenshot" });
        cmbEvidenceType.SelectedIndex = 3;
        StyleCombo(cmbEvidenceType);

        txtEvidenceSource = MakeTextBox("mvp-local");
        txtEvidenceCollector = MakeTextBox("");

        cmbEvidenceClassification = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList };
        cmbEvidenceClassification.Items.AddRange(new object[] { "public", "internal", "sensitive" });
        cmbEvidenceClassification.SelectedIndex = 1;
        StyleCombo(cmbEvidenceClassification);

        cmbEvidenceRetention = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList };
        cmbEvidenceRetention.Items.AddRange(new object[] { "short", "standard", "long", "legal" });
        cmbEvidenceRetention.SelectedIndex = 1;
        StyleCombo(cmbEvidenceRetention);

        evidenceFields.Controls.Add(MakeLabel("EvidenceId"), 0, 0);
        evidenceFields.Controls.Add(txtEvidenceId, 1, 0);
        evidenceFields.Controls.Add(MakeLabel("Type"), 2, 0);
        evidenceFields.Controls.Add(cmbEvidenceType, 3, 0);
        evidenceFields.Controls.Add(MakeLabel("Source"), 4, 0);
        evidenceFields.Controls.Add(txtEvidenceSource, 5, 0);

        evidenceFields.Controls.Add(MakeLabel("Collector"), 0, 1);
        evidenceFields.Controls.Add(txtEvidenceCollector, 1, 1);
        evidenceFields.Controls.Add(MakeLabel("Classif"), 2, 1);
        evidenceFields.Controls.Add(cmbEvidenceClassification, 3, 1);
        evidenceFields.Controls.Add(MakeLabel("Retention"), 4, 1);
        evidenceFields.Controls.Add(cmbEvidenceRetention, 5, 1);

        var evidenceActions = new FlowLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = true,
            Margin = new Padding(0, 8, 0, 0)
        };

        var btnEvidenceIngest = new Button { Text = "Ingest" };
        StylePrimary(btnEvidenceIngest);
        btnEvidenceIngest.Click += (_, _) => OnEvidenceIngest();

        var btnEvidenceVerify = new Button { Text = "Verify chain" };
        StyleSecondary(btnEvidenceVerify);
        btnEvidenceVerify.Click += (_, _) => OnEvidenceVerifyChain();

        var btnLinkRisk = new Button { Text = "Link to Risk" };
        StyleSecondary(btnLinkRisk);
        btnLinkRisk.Click += (_, _) => OnEvidenceLinkRisk();

        var btnLinkCase = new Button { Text = "Link to Case" };
        StyleSecondary(btnLinkCase);
        btnLinkCase.Click += (_, _) => OnEvidenceLinkCase();

        evidenceActions.Controls.Add(btnEvidenceIngest);
        evidenceActions.Controls.Add(btnEvidenceVerify);
        evidenceActions.Controls.Add(btnLinkRisk);
        evidenceActions.Controls.Add(btnLinkCase);

        var exportStoreRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3, Margin = new Padding(0, 8, 0, 0) };
        exportStoreRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        exportStoreRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        exportStoreRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtStoreExportScope = MakeTextBox("risk:R-TEST");
        var btnExportFromStore = new Button { Text = "Export from store" };
        StylePrimary(btnExportFromStore);
        btnExportFromStore.Click += (_, _) => OnExportFromStore();

        exportStoreRow.Controls.Add(MakeLabel("Scope"), 0, 0);
        exportStoreRow.Controls.Add(txtStoreExportScope, 1, 0);
        exportStoreRow.Controls.Add(btnExportFromStore, 2, 0);

        evidenceLayout.Controls.Add(evidencePickRow);
        evidenceLayout.Controls.Add(evidenceFields);
        evidenceLayout.Controls.Add(evidenceActions);
        evidenceLayout.Controls.Add(exportStoreRow);
        grpEvidence.Controls.Add(evidenceLayout);

        storeLayout.Controls.Add(grpLast, 0, 0);
        storeLayout.Controls.Add(grpHeads, 0, 1);
        storeLayout.Controls.Add(grpRisk, 0, 2);
        storeLayout.Controls.Add(grpDecision, 0, 3);
        storeLayout.Controls.Add(grpCase, 0, 4);
        storeLayout.Controls.Add(grpEvidence, 0, 5);
        tabStore.Controls.Add(storeLayout);

        var bundleLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            ColumnCount = 1
        };
        bundleLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var grpExport = MakeGroup("Bundle Export");
        var exportLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };

        var scopeRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        scopeRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        scopeRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        scopeRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtScopeRef = MakeTextBox("risk:R-TEST");

        var exportButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Fill,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = false
        };

        var btnExport = new Button { Text = "Export bundle" };
        StylePrimary(btnExport);
        btnExport.Click += (_, _) => OnBundleExport();

        var btnOpenBundle = new Button { Text = "Open output" };
        StyleSecondary(btnOpenBundle);
        btnOpenBundle.Click += (_, _) => OnOpenLastBundle();

        exportButtons.Controls.Add(btnExport);
        exportButtons.Controls.Add(btnOpenBundle);

        scopeRow.Controls.Add(MakeLabel("ScopeRef"), 0, 0);
        scopeRow.Controls.Add(txtScopeRef, 1, 0);
        scopeRow.Controls.Add(exportButtons, 2, 0);

        var filesRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        filesRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        filesRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        filesRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtEvidenceFiles = MakeTextBox("..\\..\\..\\..\\tmp\\evidence1.txt;..\\..\\..\\..\\tmp\\evidence2.txt");
        txtEvidenceFiles.Dock = DockStyle.Fill;

        var btnPickEvidence = new Button { Text = "Pick…" };
        StyleSecondary(btnPickEvidence);
        btnPickEvidence.Click += (_, _) => OnPickEvidenceFiles();

        filesRow.Controls.Add(MakeLabel("Files"), 0, 0);
        filesRow.Controls.Add(txtEvidenceFiles, 1, 0);
        filesRow.Controls.Add(btnPickEvidence, 2, 0);

        var signRow = new FlowLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = true,
            Margin = new Padding(0, 6, 0, 6)
        };

        chkSign = new CheckBox { Text = "Sign", AutoSize = true, Margin = new Padding(0, 6, 12, 0) };

        var lblKeyId = MakeLabel("KeyId");
        lblKeyId.Margin = new Padding(0, 8, 3, 4);
        txtKeyId = MakeTextBox("demo-signer");
        txtKeyId.Width = 180;

        var btnGenKeys = new Button { Text = "Gen keys" };
        StyleSecondary(btnGenKeys);
        btnGenKeys.Click += (_, _) => OnGenKeys();

        signRow.Controls.Add(chkSign);
        signRow.Controls.Add(lblKeyId);
        signRow.Controls.Add(txtKeyId);
        signRow.Controls.Add(btnGenKeys);

        exportLayout.Controls.Add(scopeRow, 0, 0);
        exportLayout.Controls.Add(filesRow, 0, 1);
        exportLayout.Controls.Add(signRow, 0, 2);
        grpExport.Controls.Add(exportLayout);

        var grpKeys = MakeGroup("Keys");
        var keysLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };

        var privRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        privRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        privRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        privRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtPrivKey = MakeTextBox("");
        var btnPickPriv = new Button { Text = "Browse" };
        StyleSecondary(btnPickPriv);
        btnPickPriv.Click += (_, _) => OnPickFile(txtPrivKey);

        privRow.Controls.Add(MakeLabel("Priv key"), 0, 0);
        privRow.Controls.Add(txtPrivKey, 1, 0);
        privRow.Controls.Add(btnPickPriv, 2, 0);

        var pubRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        pubRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        pubRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        pubRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtPubKey = MakeTextBox("");
        var btnPickPub = new Button { Text = "Browse" };
        StyleSecondary(btnPickPub);
        btnPickPub.Click += (_, _) => OnPickFile(txtPubKey);

        pubRow.Controls.Add(MakeLabel("Pub key"), 0, 0);
        pubRow.Controls.Add(txtPubKey, 1, 0);
        pubRow.Controls.Add(btnPickPub, 2, 0);

        keysLayout.Controls.Add(privRow, 0, 0);
        keysLayout.Controls.Add(pubRow, 0, 1);
        grpKeys.Controls.Add(keysLayout);

        bundleLayout.Controls.Add(grpExport, 0, 0);
        bundleLayout.Controls.Add(grpKeys, 0, 1);
        tabBundle.Controls.Add(bundleLayout);

        var verifyLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            ColumnCount = 1
        };
        verifyLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var grpVerify = MakeGroup("Verify Bundle");
        var verifyGroupLayout = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1 };

        var bundleRow = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 3 };
        bundleRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        bundleRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        bundleRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        txtVerifyBundle = MakeTextBox("");
        var btnPickBundle = new Button { Text = "Browse" };
        StyleSecondary(btnPickBundle);
        btnPickBundle.Click += (_, _) => OnPickBundleDir();

        bundleRow.Controls.Add(MakeLabel("Bundle dir"), 0, 0);
        bundleRow.Controls.Add(txtVerifyBundle, 1, 0);
        bundleRow.Controls.Add(btnPickBundle, 2, 0);

        var verifyActions = new FlowLayoutPanel
        {
            Dock = DockStyle.Top,
            AutoSize = true,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = true,
            Margin = new Padding(0, 6, 0, 0)
        };

        var btnVerifyManifest = new Button { Text = "Verify manifest (+sig)" };
        StylePrimary(btnVerifyManifest);
        btnVerifyManifest.Click += (_, _) => OnVerifyManifest();

        var btnVerifyHashes = new Button { Text = "Verify file hashes" };
        StyleSecondary(btnVerifyHashes);
        btnVerifyHashes.Click += (_, _) => OnVerifyHashes();

        var btnVerifyAnchor = new Button { Text = "Verify anchor" };
        StyleSecondary(btnVerifyAnchor);
        btnVerifyAnchor.Click += (_, _) => OnVerifyAuditAnchor();

        verifyActions.Controls.Add(btnVerifyManifest);
        verifyActions.Controls.Add(btnVerifyHashes);
        verifyActions.Controls.Add(btnVerifyAnchor);

        verifyGroupLayout.Controls.Add(bundleRow, 0, 0);
        verifyGroupLayout.Controls.Add(verifyActions, 0, 1);
        grpVerify.Controls.Add(verifyGroupLayout);

        verifyLayout.Controls.Add(grpVerify, 0, 0);
        tabVerifyPage.Controls.Add(verifyLayout);

        // Tools sidebar
        var toolsPanel = new Panel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(0),
            BackColor = this.BackColor
        };

        var grpTools = MakeGroup("Cybersecure tools");
        grpTools.Dock = DockStyle.Fill;

        var toolsLayout = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 1, RowCount = 12 };
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        toolsLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));

        var lblToolsHint = new Label
        {
            Text = "Quick actions (verify / anchor / rebuild)\nUse these before exports and audits.",
            AutoSize = true,
            ForeColor = subtleText,
            Margin = new Padding(3, 0, 3, 8)
        };

        lblToolStatus = new Label
        {
            Text = "Status: UNKNOWN",
            AutoSize = true,
            ForeColor = subtleText,
            Margin = new Padding(3, 0, 3, 0)
        };

        lblToolLastVerified = new Label
        {
            Text = "Last verified: —",
            AutoSize = true,
            ForeColor = subtleText,
            Margin = new Padding(3, 0, 3, 10)
        };

        var btnTVerify = new Button { Text = "Verify events" };
        StyleSecondary(btnTVerify);
        btnTVerify.Click += (_, _) => OnVerifyEvents();

        var btnTMigrate = new Button { Text = "Migrate legacy" };
        StyleSecondary(btnTMigrate);
        btnTMigrate.Click += (_, _) => OnMigrateLegacyEvents();

        var btnTRebuild = new Button { Text = "Rebuild projections" };
        StyleSecondary(btnTRebuild);
        btnTRebuild.Click += (_, _) => OnRebuildFromEvents();

        var btnTExportAnchor = new Button { Text = "Export anchor" };
        StyleSecondary(btnTExportAnchor);
        btnTExportAnchor.Click += (_, _) => OnExportAuditAnchor();

        var btnTVerifyAnchor = new Button { Text = "Verify anchor" };
        StyleSecondary(btnTVerifyAnchor);
        btnTVerifyAnchor.Click += (_, _) => OnVerifyAuditAnchor();

        var btnTOpenStore = new Button { Text = "Open store" };
        StyleSecondary(btnTOpenStore);
        btnTOpenStore.Click += (_, _) => OnOpenStoreDir();

        var btnTOpenBundle = new Button { Text = "Open last bundle" };
        StyleSecondary(btnTOpenBundle);
        btnTOpenBundle.Click += (_, _) => OnOpenLastBundle();

        var btnTRefreshHeads = new Button { Text = "Refresh head hashes" };
        StyleSecondary(btnTRefreshHeads);
        btnTRefreshHeads.Click += (_, _) => OnRefreshEventHeads();

        toolsLayout.Controls.Add(lblToolsHint, 0, 0);
        toolsLayout.Controls.Add(lblToolStatus, 0, 1);
        toolsLayout.Controls.Add(lblToolLastVerified, 0, 2);
        toolsLayout.Controls.Add(btnTVerify, 0, 3);
        toolsLayout.Controls.Add(btnTMigrate, 0, 4);
        toolsLayout.Controls.Add(btnTRebuild, 0, 5);
        toolsLayout.Controls.Add(btnTRefreshHeads, 0, 6);
        toolsLayout.Controls.Add(btnTExportAnchor, 0, 7);
        toolsLayout.Controls.Add(btnTVerifyAnchor, 0, 8);
        toolsLayout.Controls.Add(btnTOpenStore, 0, 10);
        toolsLayout.Controls.Add(btnTOpenBundle, 0, 11);

        grpTools.Controls.Add(toolsLayout);
        toolsPanel.Controls.Add(grpTools);

        splitMain = new SplitContainer
        {
            Dock = DockStyle.Fill,
            Orientation = Orientation.Vertical
        };
        splitMain.Panel1.Padding = new Padding(0, 0, 12, 0);
        splitMain.Panel1.Controls.Add(toolsPanel);
        splitMain.Panel2.Controls.Add(tabsMain);

        var root = new Panel { Dock = DockStyle.Fill, BackColor = this.BackColor, Padding = new Padding(10) };
        root.Controls.Add(splitMain);
        root.Controls.Add(logCard);
        root.Controls.Add(headerCard);

        this.Controls.Add(root);
    }
}
