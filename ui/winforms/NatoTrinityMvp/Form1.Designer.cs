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
        this.ClientSize = new System.Drawing.Size(1100, 700);
        this.MinimumSize = new System.Drawing.Size(900, 600);

        var tabs = new TabControl { Dock = DockStyle.Fill };
        var tabStore = new TabPage("Store") { Padding = new Padding(10) };
        var tabBundle = new TabPage("Bundles") { Padding = new Padding(10) };
        var tabVerify = new TabPage("Verify") { Padding = new Padding(10) };

        tabs.TabPages.Add(tabStore);
        tabs.TabPages.Add(tabBundle);
        tabs.TabPages.Add(tabVerify);

        // Common top panel
        var top = new Panel { Dock = DockStyle.Top, Height = 70 };
        var lblBase = new Label { Left = 10, Top = 10, Width = 90, Text = "Base dir" };
        txtBaseDir = new TextBox { Left = 100, Top = 8, Width = 720, Text = "..\\..\\..\\..\\deliverables-demo", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        var btnPickBase = new Button { Left = 830, Top = 6, Width = 90, Text = "Browse", Anchor = AnchorStyles.Top | AnchorStyles.Right };
        btnPickBase.Click += (_, _) => OnPickBaseDir();

        var lblOrg = new Label { Left = 10, Top = 40, Width = 90, Text = "OrgId" };
        txtOrg = new TextBox { Left = 100, Top = 38, Width = 140, Text = "ACME" };
        var lblActor = new Label { Left = 260, Top = 40, Width = 90, Text = "Actor" };
        txtActor = new TextBox { Left = 320, Top = 38, Width = 140, Text = "bob" };

        top.Controls.AddRange([lblBase, txtBaseDir, btnPickBase, lblOrg, txtOrg, lblActor, txtActor]);

        // Log panel
        txtLog = new TextBox { Dock = DockStyle.Bottom, Height = 180, Multiline = true, ScrollBars = ScrollBars.Both, ReadOnly = true, WordWrap = false };

        // STORE TAB
        var y = 10;
        var btnRiskCreate = new Button { Left = 10, Top = y, Width = 160, Text = "Create Risk" };
        btnRiskCreate.Click += (_, _) => OnRiskCreate();
        var btnRiskGet = new Button { Left = 180, Top = y, Width = 160, Text = "Get Risk" };
        btnRiskGet.Click += (_, _) => OnRiskGet();
        y += 40;

        tabStore.Controls.Add(btnRiskCreate);
        tabStore.Controls.Add(btnRiskGet);

        tabStore.Controls.Add(new Label { Left = 10, Top = y, Width = 90, Text = "RiskId" });
        txtRiskId = new TextBox { Left = 100, Top = y - 2, Width = 160, Text = "R-TEST" };
        tabStore.Controls.Add(txtRiskId);

        tabStore.Controls.Add(new Label { Left = 280, Top = y, Width = 90, Text = "Title" });
        txtRiskTitle = new TextBox { Left = 330, Top = y - 2, Width = 300, Text = "Test risk", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        tabStore.Controls.Add(txtRiskTitle);

        tabStore.Controls.Add(new Label { Left = 650, Top = y, Width = 90, Text = "Owner" });
        txtRiskOwner = new TextBox { Left = 710, Top = y - 2, Width = 160, Text = "alice" };
        tabStore.Controls.Add(txtRiskOwner);

        y += 35;
        tabStore.Controls.Add(new Label { Left = 10, Top = y, Width = 90, Text = "Likelihood" });
        numLikelihood = new NumericUpDown { Left = 100, Top = y - 2, Width = 60, Minimum = 1, Maximum = 5, Value = 3 };
        tabStore.Controls.Add(numLikelihood);

        tabStore.Controls.Add(new Label { Left = 180, Top = y, Width = 60, Text = "Impact" });
        numImpact = new NumericUpDown { Left = 240, Top = y - 2, Width = 60, Minimum = 1, Maximum = 5, Value = 4 };
        tabStore.Controls.Add(numImpact);

        tabStore.Controls.Add(new Label { Left = 320, Top = y, Width = 80, Text = "Due" });
        txtDue = new TextBox { Left = 360, Top = y - 2, Width = 120, Text = "2026-03-01" };
        tabStore.Controls.Add(txtDue);

        y += 45;
        var btnDecisionCreate = new Button { Left = 10, Top = y, Width = 160, Text = "Create Decision" };
        btnDecisionCreate.Click += (_, _) => OnDecisionCreate();
        tabStore.Controls.Add(btnDecisionCreate);

        tabStore.Controls.Add(new Label { Left = 180, Top = y + 5, Width = 90, Text = "Type" });
        txtDecisionType = new TextBox { Left = 230, Top = y + 3, Width = 80, Text = "accept" };
        tabStore.Controls.Add(txtDecisionType);

        tabStore.Controls.Add(new Label { Left = 330, Top = y + 5, Width = 90, Text = "ApprovedBy" });
        txtDecisionApprovedBy = new TextBox { Left = 410, Top = y + 3, Width = 120, Text = "ciso" };
        tabStore.Controls.Add(txtDecisionApprovedBy);

        tabStore.Controls.Add(new Label { Left = 550, Top = y + 5, Width = 90, Text = "Expiry" });
        txtDecisionExpiry = new TextBox { Left = 600, Top = y + 3, Width = 120, Text = "2026-04-01" };
        tabStore.Controls.Add(txtDecisionExpiry);

        y += 35;
        tabStore.Controls.Add(new Label { Left = 180, Top = y + 5, Width = 90, Text = "Rationale" });
        txtDecisionRationale = new TextBox { Left = 250, Top = y + 3, Width = 620, Text = "Business need", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        tabStore.Controls.Add(txtDecisionRationale);

        y += 55;
        var btnCaseCreate = new Button { Left = 10, Top = y, Width = 160, Text = "Create Case" };
        btnCaseCreate.Click += (_, _) => OnCaseCreate();
        var btnCaseGet = new Button { Left = 180, Top = y, Width = 160, Text = "Get Case" };
        btnCaseGet.Click += (_, _) => OnCaseGet();
        tabStore.Controls.Add(btnCaseCreate);
        tabStore.Controls.Add(btnCaseGet);

        y += 40;
        tabStore.Controls.Add(new Label { Left = 10, Top = y, Width = 90, Text = "CaseId" });
        txtCaseId = new TextBox { Left = 100, Top = y - 2, Width = 160, Text = "C-TEST" };
        tabStore.Controls.Add(txtCaseId);

        tabStore.Controls.Add(new Label { Left = 280, Top = y, Width = 90, Text = "Severity" });
        cmbSeverity = new ComboBox { Left = 340, Top = y - 2, Width = 120, DropDownStyle = ComboBoxStyle.DropDownList };
        cmbSeverity.Items.AddRange(["low", "medium", "high", "critical"]);
        cmbSeverity.SelectedIndex = 2;
        tabStore.Controls.Add(cmbSeverity);

        tabStore.Controls.Add(new Label { Left = 480, Top = y, Width = 90, Text = "Status" });
        cmbCaseStatus = new ComboBox { Left = 530, Top = y - 2, Width = 140, DropDownStyle = ComboBoxStyle.DropDownList };
        cmbCaseStatus.Items.AddRange(["new", "triage", "investigate", "contain", "eradicate", "recover", "closed"]);
        cmbCaseStatus.SelectedIndex = 1;
        tabStore.Controls.Add(cmbCaseStatus);

        tabStore.Controls.Add(new Label { Left = 690, Top = y, Width = 90, Text = "Owner" });
        txtCaseOwner = new TextBox { Left = 740, Top = y - 2, Width = 130, Text = "soclead" };
        tabStore.Controls.Add(txtCaseOwner);

        // BUNDLE TAB
        var yb = 10;
        tabBundle.Controls.Add(new Label { Left = 10, Top = yb, Width = 90, Text = "ScopeRef" });
        txtScopeRef = new TextBox { Left = 100, Top = yb - 2, Width = 400, Text = "risk:R-TEST" };
        tabBundle.Controls.Add(txtScopeRef);

        var btnExport = new Button { Left = 520, Top = yb - 4, Width = 160, Text = "Export bundle" };
        btnExport.Click += (_, _) => OnBundleExport();
        tabBundle.Controls.Add(btnExport);

        yb += 35;
        tabBundle.Controls.Add(new Label { Left = 10, Top = yb, Width = 90, Text = "Files" });
        txtEvidenceFiles = new TextBox { Left = 100, Top = yb - 2, Width = 780, Text = "..\\..\\..\\..\\tmp\\evidence1.txt;..\\..\\..\\..\\tmp\\evidence2.txt", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        tabBundle.Controls.Add(txtEvidenceFiles);

        yb += 35;
        chkSign = new CheckBox { Left = 100, Top = yb, Width = 100, Text = "Sign" };
        tabBundle.Controls.Add(chkSign);

        tabBundle.Controls.Add(new Label { Left = 220, Top = yb, Width = 90, Text = "KeyId" });
        txtKeyId = new TextBox { Left = 260, Top = yb - 2, Width = 140, Text = "demo-signer" };
        tabBundle.Controls.Add(txtKeyId);

        var btnGenKeys = new Button { Left = 420, Top = yb - 4, Width = 160, Text = "Gen keys" };
        btnGenKeys.Click += (_, _) => OnGenKeys();
        tabBundle.Controls.Add(btnGenKeys);

        yb += 35;
        tabBundle.Controls.Add(new Label { Left = 10, Top = yb, Width = 90, Text = "Priv key" });
        txtPrivKey = new TextBox { Left = 100, Top = yb - 2, Width = 520, Text = "", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        tabBundle.Controls.Add(txtPrivKey);

        var btnPickPriv = new Button { Left = 630, Top = yb - 4, Width = 90, Text = "Browse", Anchor = AnchorStyles.Top | AnchorStyles.Right };
        btnPickPriv.Click += (_, _) => OnPickFile(txtPrivKey);
        tabBundle.Controls.Add(btnPickPriv);

        yb += 35;
        tabBundle.Controls.Add(new Label { Left = 10, Top = yb, Width = 90, Text = "Pub key" });
        txtPubKey = new TextBox { Left = 100, Top = yb - 2, Width = 520, Text = "", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        tabBundle.Controls.Add(txtPubKey);

        var btnPickPub = new Button { Left = 630, Top = yb - 4, Width = 90, Text = "Browse", Anchor = AnchorStyles.Top | AnchorStyles.Right };
        btnPickPub.Click += (_, _) => OnPickFile(txtPubKey);
        tabBundle.Controls.Add(btnPickPub);

        // VERIFY TAB
        var yv = 10;
        tabVerify.Controls.Add(new Label { Left = 10, Top = yv, Width = 120, Text = "Bundle dir" });
        txtVerifyBundle = new TextBox { Left = 130, Top = yv - 2, Width = 750, Text = "", Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right };
        tabVerify.Controls.Add(txtVerifyBundle);

        var btnPickBundle = new Button { Left = 890, Top = yv - 4, Width = 90, Text = "Browse", Anchor = AnchorStyles.Top | AnchorStyles.Right };
        btnPickBundle.Click += (_, _) => OnPickBundleDir();
        tabVerify.Controls.Add(btnPickBundle);

        yv += 40;
        var btnVerifyManifest = new Button { Left = 130, Top = yv, Width = 220, Text = "Verify manifest (+sig)" };
        btnVerifyManifest.Click += (_, _) => OnVerifyManifest();
        tabVerify.Controls.Add(btnVerifyManifest);

        var btnVerifyHashes = new Button { Left = 360, Top = yv, Width = 220, Text = "Verify file hashes" };
        btnVerifyHashes.Click += (_, _) => OnVerifyHashes();
        tabVerify.Controls.Add(btnVerifyHashes);

        var root = new Panel { Dock = DockStyle.Fill };
        root.Controls.Add(tabs);
        root.Controls.Add(top);
        root.Controls.Add(txtLog);

        this.Controls.Add(root);
    }
}
