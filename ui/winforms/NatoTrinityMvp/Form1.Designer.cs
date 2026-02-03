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

    private TextBox txtDecisionType = null!;
    private TextBox txtDecisionRationale = null!;
    private TextBox txtDecisionApprovedBy = null!;
    private TextBox txtDecisionExpiry = null!;

    private TextBox txtCaseId = null!;
    private ComboBox cmbSeverity = null!;
    private ComboBox cmbCaseStatus = null!;
    private TextBox txtCaseOwner = null!;

    private TextBox txtScopeRef = null!;
    private TextBox txtEvidenceFiles = null!;
    private CheckBox chkSign = null!;
    private TextBox txtPrivKey = null!;
    private TextBox txtPubKey = null!;
    private TextBox txtKeyId = null!;

    private TextBox txtVerifyBundle = null!;

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
        this.Text = "NATO Trinity MVP (WinForms)";
        this.ClientSize = new System.Drawing.Size(1150, 760);
        this.MinimumSize = new System.Drawing.Size(980, 650);

        // Root: vertical split (main content / log)
        var split = new SplitContainer
        {
            Dock = DockStyle.Fill,
            Orientation = Orientation.Horizontal,
            SplitterDistance = 520,
            Panel1MinSize = 420,
            Panel2MinSize = 140
        };

        // Top area: top config row + tabs
        var topLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 1,
            RowCount = 2,
            Padding = new Padding(8)
        };
        topLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        topLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        // Header config row
        var header = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            ColumnCount = 7,
            RowCount = 1,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink
        };
        header.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize)); // Base label
        header.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100)); // Base textbox
        header.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize)); // Browse
        header.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize)); // Org label
        header.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 140)); // Org textbox
        header.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize)); // Actor label
        header.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160)); // Actor textbox

        var lblBase = new Label { Text = "Base dir", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(0, 6, 8, 0) };
        txtBaseDir = new TextBox { Dock = DockStyle.Fill, Text = "..\\..\\..\\..\\deliverables-demo" };
        var btnPickBase = new Button { Text = "Browse", AutoSize = true, Anchor = AnchorStyles.Left };
        btnPickBase.Click += (_, _) => OnPickBaseDir();

        var lblOrg = new Label { Text = "OrgId", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) };
        txtOrg = new TextBox { Dock = DockStyle.Fill, Text = "ACME" };

        var lblActor = new Label { Text = "Actor", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) };
        txtActor = new TextBox { Dock = DockStyle.Fill, Text = "bob" };

        header.Controls.Add(lblBase, 0, 0);
        header.Controls.Add(txtBaseDir, 1, 0);
        header.Controls.Add(btnPickBase, 2, 0);
        header.Controls.Add(lblOrg, 3, 0);
        header.Controls.Add(txtOrg, 4, 0);
        header.Controls.Add(lblActor, 5, 0);
        header.Controls.Add(txtActor, 6, 0);

        // Tabs
        var tabs = new TabControl { Dock = DockStyle.Fill };
        var tabStore = new TabPage("Store") { Padding = new Padding(8) };
        var tabBundle = new TabPage("Bundles") { Padding = new Padding(8) };
        var tabVerify = new TabPage("Verify") { Padding = new Padding(8) };
        tabs.TabPages.Add(tabStore);
        tabs.TabPages.Add(tabBundle);
        tabs.TabPages.Add(tabVerify);

        topLayout.Controls.Add(header, 0, 0);
        topLayout.Controls.Add(tabs, 0, 1);

        split.Panel1.Controls.Add(topLayout);

        // Log
        txtLog = new TextBox
        {
            Dock = DockStyle.Fill,
            Multiline = true,
            ScrollBars = ScrollBars.Both,
            ReadOnly = true,
            WordWrap = false
        };
        split.Panel2.Padding = new Padding(8);
        split.Panel2.Controls.Add(txtLog);

        // STORE TAB content
        var storeLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 1,
            RowCount = 4,
            AutoScroll = true
        };
        storeLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize)); // buttons
        storeLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize)); // risk grid
        storeLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize)); // decision grid
        storeLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize)); // case grid
        tabStore.Controls.Add(storeLayout);

        var pnlRiskButtons = new FlowLayoutPanel { Dock = DockStyle.Fill, AutoSize = true, WrapContents = true };
        var btnRiskCreate = new Button { Text = "Create Risk", AutoSize = true };
        btnRiskCreate.Click += (_, _) => OnRiskCreate();
        var btnRiskGet = new Button { Text = "Get Risk", AutoSize = true };
        btnRiskGet.Click += (_, _) => OnRiskGet();
        pnlRiskButtons.Controls.Add(btnRiskCreate);
        pnlRiskButtons.Controls.Add(btnRiskGet);
        storeLayout.Controls.Add(pnlRiskButtons, 0, 0);

        var riskGrid = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            ColumnCount = 6,
            RowCount = 2,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink
        };
        riskGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        riskGrid.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 40));
        riskGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        riskGrid.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 60));
        riskGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        riskGrid.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 180));

        riskGrid.Controls.Add(new Label { Text = "RiskId", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        txtRiskId = new TextBox { Dock = DockStyle.Fill, Text = "R-TEST" };
        riskGrid.Controls.Add(txtRiskId, 1, 0);

        riskGrid.Controls.Add(new Label { Text = "Title", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 2, 0);
        txtRiskTitle = new TextBox { Dock = DockStyle.Fill, Text = "Test risk" };
        riskGrid.Controls.Add(txtRiskTitle, 3, 0);

        riskGrid.Controls.Add(new Label { Text = "Owner", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 4, 0);
        txtRiskOwner = new TextBox { Dock = DockStyle.Fill, Text = "alice" };
        riskGrid.Controls.Add(txtRiskOwner, 5, 0);

        riskGrid.Controls.Add(new Label { Text = "Likelihood", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 1);
        numLikelihood = new NumericUpDown { Dock = DockStyle.Left, Minimum = 1, Maximum = 5, Value = 3, Width = 80 };
        riskGrid.Controls.Add(numLikelihood, 1, 1);

        riskGrid.Controls.Add(new Label { Text = "Impact", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 2, 1);
        numImpact = new NumericUpDown { Dock = DockStyle.Left, Minimum = 1, Maximum = 5, Value = 4, Width = 80 };
        riskGrid.Controls.Add(numImpact, 3, 1);

        riskGrid.Controls.Add(new Label { Text = "Due", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 4, 1);
        txtDue = new TextBox { Dock = DockStyle.Fill, Text = "2026-03-01" };
        riskGrid.Controls.Add(txtDue, 5, 1);

        storeLayout.Controls.Add(riskGrid, 0, 1);

        var decisionGrid = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            ColumnCount = 6,
            RowCount = 2,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            Margin = new Padding(0, 14, 0, 0)
        };
        decisionGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionGrid.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160));
        decisionGrid.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        decisionGrid.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160));

        var btnDecisionCreate = new Button { Text = "Create Decision", AutoSize = true };
        btnDecisionCreate.Click += (_, _) => OnDecisionCreate();
        decisionGrid.Controls.Add(btnDecisionCreate, 0, 0);

        decisionGrid.Controls.Add(new Label { Text = "Type", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 1, 0);
        txtDecisionType = new TextBox { Dock = DockStyle.Fill, Text = "accept" };
        decisionGrid.Controls.Add(txtDecisionType, 2, 0);

        decisionGrid.Controls.Add(new Label { Text = "ApprovedBy", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 3, 0);
        txtDecisionApprovedBy = new TextBox { Dock = DockStyle.Fill, Text = "ciso" };
        decisionGrid.Controls.Add(txtDecisionApprovedBy, 4, 0);

        decisionGrid.Controls.Add(new Label { Text = "Expiry", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 5, 0);
        txtDecisionExpiry = new TextBox { Dock = DockStyle.Fill, Text = "2026-04-01" };
        decisionGrid.Controls.Add(txtDecisionExpiry, 5, 1);

        // Rationale row
        var rationaleRow = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            ColumnCount = 2,
            RowCount = 1,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            Margin = new Padding(0, 6, 0, 0)
        };
        rationaleRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        rationaleRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        rationaleRow.Controls.Add(new Label { Text = "Rationale", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        txtDecisionRationale = new TextBox { Dock = DockStyle.Fill, Text = "Business need" };
        rationaleRow.Controls.Add(txtDecisionRationale, 1, 0);

        var decisionContainer = new Panel { Dock = DockStyle.Top, AutoSize = true, AutoSizeMode = AutoSizeMode.GrowAndShrink };
        decisionContainer.Controls.Add(rationaleRow);
        decisionContainer.Controls.Add(decisionGrid);
        storeLayout.Controls.Add(decisionContainer, 0, 2);

        var caseContainer = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            ColumnCount = 7,
            RowCount = 2,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            Margin = new Padding(0, 14, 0, 0)
        };
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160));
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 180));
        caseContainer.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var pnlCaseButtons = new FlowLayoutPanel { Dock = DockStyle.Fill, AutoSize = true, WrapContents = true };
        var btnCaseCreate = new Button { Text = "Create Case", AutoSize = true };
        btnCaseCreate.Click += (_, _) => OnCaseCreate();
        var btnCaseGet = new Button { Text = "Get Case", AutoSize = true };
        btnCaseGet.Click += (_, _) => OnCaseGet();
        pnlCaseButtons.Controls.Add(btnCaseCreate);
        pnlCaseButtons.Controls.Add(btnCaseGet);
        caseContainer.Controls.Add(pnlCaseButtons, 0, 0);
        caseContainer.SetColumnSpan(pnlCaseButtons, 7);

        caseContainer.Controls.Add(new Label { Text = "CaseId", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 1);
        txtCaseId = new TextBox { Dock = DockStyle.Fill, Text = "C-TEST" };
        caseContainer.Controls.Add(txtCaseId, 1, 1);

        caseContainer.Controls.Add(new Label { Text = "Severity", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 2, 1);
        cmbSeverity = new ComboBox { Dock = DockStyle.Fill, DropDownStyle = ComboBoxStyle.DropDownList };
        cmbSeverity.Items.AddRange(["low", "medium", "high", "critical"]);
        cmbSeverity.SelectedIndex = 2;
        caseContainer.Controls.Add(cmbSeverity, 3, 1);

        caseContainer.Controls.Add(new Label { Text = "Status", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 4, 1);
        cmbCaseStatus = new ComboBox { Dock = DockStyle.Fill, DropDownStyle = ComboBoxStyle.DropDownList };
        cmbCaseStatus.Items.AddRange(["new", "triage", "investigate", "contain", "eradicate", "recover", "closed"]);
        cmbCaseStatus.SelectedIndex = 1;
        caseContainer.Controls.Add(cmbCaseStatus, 5, 1);

        caseContainer.Controls.Add(new Label { Text = "Owner", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(12, 6, 8, 0) }, 6, 1);
        txtCaseOwner = new TextBox { Dock = DockStyle.Fill, Text = "soclead" };
        caseContainer.Controls.Add(txtCaseOwner, 6, 1);

        storeLayout.Controls.Add(caseContainer, 0, 3);

        // BUNDLE TAB content
        var bundleLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 3,
            RowCount = 6,
            AutoScroll = true
        };
        bundleLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        bundleLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        bundleLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        tabBundle.Controls.Add(bundleLayout);

        bundleLayout.Controls.Add(new Label { Text = "ScopeRef", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        txtScopeRef = new TextBox { Dock = DockStyle.Fill, Text = "risk:R-TEST" };
        bundleLayout.Controls.Add(txtScopeRef, 1, 0);

        var btnExport = new Button { Text = "Export bundle", AutoSize = true };
        btnExport.Click += (_, _) => OnBundleExport();
        bundleLayout.Controls.Add(btnExport, 2, 0);

        bundleLayout.Controls.Add(new Label { Text = "Files", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 1);
        txtEvidenceFiles = new TextBox { Dock = DockStyle.Fill, Text = "..\\..\\..\\..\\tmp\\evidence1.txt;..\\..\\..\\..\\tmp\\evidence2.txt" };
        bundleLayout.Controls.Add(txtEvidenceFiles, 1, 1);
        bundleLayout.SetColumnSpan(txtEvidenceFiles, 2);

        chkSign = new CheckBox { Text = "Sign", AutoSize = true, Anchor = AnchorStyles.Left };
        bundleLayout.Controls.Add(chkSign, 1, 2);

        var keyRow = new FlowLayoutPanel { Dock = DockStyle.Fill, AutoSize = true };
        keyRow.Controls.Add(new Label { Text = "KeyId", AutoSize = true, Margin = new Padding(0, 6, 8, 0) });
        txtKeyId = new TextBox { Width = 180, Text = "demo-signer" };
        keyRow.Controls.Add(txtKeyId);
        var btnGenKeys = new Button { Text = "Gen keys", AutoSize = true, Margin = new Padding(12, 0, 0, 0) };
        btnGenKeys.Click += (_, _) => OnGenKeys();
        keyRow.Controls.Add(btnGenKeys);
        bundleLayout.Controls.Add(keyRow, 1, 3);
        bundleLayout.SetColumnSpan(keyRow, 2);

        bundleLayout.Controls.Add(new Label { Text = "Priv key", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 4);
        txtPrivKey = new TextBox { Dock = DockStyle.Fill, Text = "" };
        bundleLayout.Controls.Add(txtPrivKey, 1, 4);
        var btnPickPriv = new Button { Text = "Browse", AutoSize = true };
        btnPickPriv.Click += (_, _) => OnPickFile(txtPrivKey);
        bundleLayout.Controls.Add(btnPickPriv, 2, 4);

        bundleLayout.Controls.Add(new Label { Text = "Pub key", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 5);
        txtPubKey = new TextBox { Dock = DockStyle.Fill, Text = "" };
        bundleLayout.Controls.Add(txtPubKey, 1, 5);
        var btnPickPub = new Button { Text = "Browse", AutoSize = true };
        btnPickPub.Click += (_, _) => OnPickFile(txtPubKey);
        bundleLayout.Controls.Add(btnPickPub, 2, 5);

        // VERIFY TAB content
        var verifyLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 3,
            RowCount = 3,
            AutoScroll = true
        };
        verifyLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        verifyLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        verifyLayout.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        tabVerify.Controls.Add(verifyLayout);

        verifyLayout.Controls.Add(new Label { Text = "Bundle dir", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        txtVerifyBundle = new TextBox { Dock = DockStyle.Fill, Text = "" };
        verifyLayout.Controls.Add(txtVerifyBundle, 1, 0);
        var btnPickBundle = new Button { Text = "Browse", AutoSize = true };
        btnPickBundle.Click += (_, _) => OnPickBundleDir();
        verifyLayout.Controls.Add(btnPickBundle, 2, 0);

        var verifyButtons = new FlowLayoutPanel { Dock = DockStyle.Fill, AutoSize = true, WrapContents = true, Margin = new Padding(0, 12, 0, 0) };
        var btnVerifyManifest = new Button { Text = "Verify manifest (+sig)", AutoSize = true };
        btnVerifyManifest.Click += (_, _) => OnVerifyManifest();
        var btnVerifyHashes = new Button { Text = "Verify file hashes", AutoSize = true };
        btnVerifyHashes.Click += (_, _) => OnVerifyHashes();
        verifyButtons.Controls.Add(btnVerifyManifest);
        verifyButtons.Controls.Add(btnVerifyHashes);
        verifyLayout.Controls.Add(verifyButtons, 1, 1);
        verifyLayout.SetColumnSpan(verifyButtons, 2);

        // final
        this.Controls.Add(split);
    }
}
