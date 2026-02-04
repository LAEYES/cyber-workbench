using NSec.Cryptography;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace NatoTrinityMvp;

public static class MvpBundle
{
    public sealed record EvidenceInput(
        string Path,
        string? EvidenceId = null,
        string? EvidenceType = null,
        string? SourceSystem = null,
        string? CollectedAt = null,
        string? CollectorId = null,
        string? Classification = null,
        string? RetentionClass = null
    );

    private static readonly JsonSerializerOptions JsonOpts = new() { WriteIndented = true };

    public static string ExportEvidencePackage(
        string outDir,
        string scopeRef,
        string orgId,
        IEnumerable<string> inputFiles,
        bool sign,
        string? privateKeyPath,
        string keyId,
        Action<string> log
    )
    {
        var inputs = inputFiles.Select(p => new EvidenceInput(Path: p));
        return ExportEvidencePackageV2(outDir, scopeRef, orgId, inputs, sign, privateKeyPath, keyId, log);
    }

    public static string ExportEvidencePackageV2(
        string outDir,
        string scopeRef,
        string orgId,
        IEnumerable<EvidenceInput> inputs,
        bool sign,
        string? privateKeyPath,
        string keyId,
        Action<string> log
    )
    {
        if (string.IsNullOrWhiteSpace(scopeRef)) throw new ArgumentException("scopeRef required");

        var bundleDir = Path.Combine(Path.GetFullPath(outDir), "nato-mvp", Sanitize(scopeRef));
        var evidenceDir = Path.Combine(bundleDir, "evidence");
        Directory.CreateDirectory(evidenceDir);

        var inputList = inputs.ToList();
        if (inputList.Count == 0) throw new InvalidOperationException("No evidence input files");

        var evidenceEntities = new List<Dictionary<string, object?>>();
        var manifestItems = new List<Dictionary<string, object?>>();

        var idx = 0;
        foreach (var input in inputList)
        {
            idx++;
            var abs = Path.GetFullPath(input.Path);
            if (!File.Exists(abs)) throw new FileNotFoundException(abs);

            var evidenceId = string.IsNullOrWhiteSpace(input.EvidenceId) ? $"ev_{idx}" : input.EvidenceId!;
            var filename = Path.GetFileName(abs);
            var storageRef = $"evidence/{Sanitize(evidenceId)}_{filename}";
            var targetPath = Path.Combine(bundleDir, storageRef);
            Directory.CreateDirectory(Path.GetDirectoryName(targetPath)!);
            File.Copy(abs, targetPath, overwrite: true);

            var hash = MvpStore.Sha256File(targetPath);

            var evidenceType = string.IsNullOrWhiteSpace(input.EvidenceType) ? "report" : input.EvidenceType!;
            var sourceSystem = string.IsNullOrWhiteSpace(input.SourceSystem) ? "winforms-mvp" : input.SourceSystem!;
            var collectedAt = string.IsNullOrWhiteSpace(input.CollectedAt) ? DateTime.UtcNow.ToString("O") : input.CollectedAt!;
            var collectorId = string.IsNullOrWhiteSpace(input.CollectorId) ? "winforms-mvp" : input.CollectorId!;
            var classification = string.IsNullOrWhiteSpace(input.Classification) ? "internal" : input.Classification!;
            var retentionClass = string.IsNullOrWhiteSpace(input.RetentionClass) ? "standard" : input.RetentionClass!;

            // Evidence entity (schema-shaped; aligns with CLI)
            evidenceEntities.Add(new()
            {
                ["id"] = $"evidence_{Guid.NewGuid():D}",
                ["type"] = "evidence",
                ["version"] = 1,
                ["createdAt"] = DateTime.UtcNow.ToString("O"),
                ["createdBy"] = "winforms-mvp",

                ["evidenceId"] = evidenceId,
                ["evidenceType"] = evidenceType,
                ["sourceSystem"] = sourceSystem,
                ["collectedAt"] = collectedAt,
                ["collectorId"] = collectorId,

                ["hash"] = hash,
                ["hashAlg"] = "sha256",
                ["storageRef"] = storageRef,

                ["classification"] = classification,
                ["retentionClass"] = retentionClass,
                ["metadata"] = new Dictionary<string, object?>()
            });

            manifestItems.Add(new()
            {
                ["evidenceId"] = evidenceId,
                ["hash"] = hash,
                ["storageRef"] = storageRef,
                ["evidenceType"] = evidenceType,
                ["sourceSystem"] = sourceSystem,
                ["collectedAt"] = collectedAt
            });
        }

        var packageId = $"pkg_{Sanitize(scopeRef)}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var manifestBase = new Dictionary<string, object?>
        {
            ["manifestVersion"] = "1.0",
            ["packageId"] = packageId,
            ["generatedAt"] = DateTime.UtcNow.ToString("O"),
            ["generatedBy"] = "WinForms NATO MVP",
            ["hashAlg"] = "sha256",
            ["items"] = manifestItems
        };

        if (sign)
        {
            if (string.IsNullOrWhiteSpace(privateKeyPath)) throw new InvalidOperationException("privateKeyPath required for signing");
            var privBytes = Ed25519Pem.ReadPrivateKeyBytes(privateKeyPath);
            var algorithm = SignatureAlgorithm.Ed25519;
            using var key = Key.Import(algorithm, privBytes, KeyBlobFormat.RawPrivateKey);

            var payloadJson = JsonSerializer.Serialize(manifestBase);
            var sig = algorithm.Sign(key, Encoding.UTF8.GetBytes(payloadJson));

            manifestBase["signature"] = new Dictionary<string, object?>
            {
                ["keyId"] = keyId,
                ["alg"] = "ed25519",
                ["value"] = Convert.ToBase64String(sig)
            };
        }

        var manifestJson = JsonSerializer.Serialize(manifestBase, JsonOpts) + "\n";
        File.WriteAllText(Path.Combine(bundleDir, "manifest.json"), manifestJson, Encoding.UTF8);

        var manifestHash = Sha256Text(manifestJson);

        var evidencePackage = new Dictionary<string, object?>
        {
            ["id"] = $"evidencePackage_{Guid.NewGuid():D}",
            ["type"] = "evidencePackage",
            ["version"] = 1,
            ["createdAt"] = DateTime.UtcNow.ToString("O"),
            ["createdBy"] = "winforms-mvp",

            ["packageId"] = packageId,
            ["scopeRef"] = scopeRef,
            ["evidenceRefs"] = evidenceEntities.Select(i => (string)i["evidenceId"]!).ToArray(),
            ["manifestHash"] = manifestHash,
            ["manifestAlg"] = "sha256",
            ["classification"] = "internal",
            ["exportedAt"] = DateTime.UtcNow.ToString("O"),
            ["exportedBy"] = "winforms-mvp",
            ["bundleRef"] = bundleDir,
            ["orgId"] = orgId
        };

        File.WriteAllText(Path.Combine(bundleDir, "evidence-package.json"), JsonSerializer.Serialize(evidencePackage, JsonOpts) + "\n", Encoding.UTF8);
        File.WriteAllText(Path.Combine(bundleDir, "evidence.json"), JsonSerializer.Serialize(evidenceEntities, JsonOpts) + "\n", Encoding.UTF8);

        File.WriteAllText(Path.Combine(bundleDir, "README.txt"),
            $"NATO MVP bundle\n\nscopeRef: {scopeRef}\npackageId: {packageId}\n\nVerify: use cyberwb nato:mvp-verify-* or compute sha256 per manifest.json\n",
            Encoding.UTF8);

        log($"OK bundle: {bundleDir}");
        return bundleDir;
    }

    public static void GenerateEd25519Keys(string outDir, string name, Action<string> log)
    {
        Directory.CreateDirectory(outDir);

        var algorithm = SignatureAlgorithm.Ed25519;
        using var key = new Key(algorithm, new KeyCreationParameters
        {
            ExportPolicy = KeyExportPolicies.AllowPlaintextExport
        });
        var pub = key.Export(KeyBlobFormat.RawPublicKey);
        var priv = key.Export(KeyBlobFormat.RawPrivateKey);

        var pubPath = Path.Combine(outDir, $"{name}.public.pem");
        var privPath = Path.Combine(outDir, $"{name}.private.pem");

        Ed25519Pem.WritePublicKeyPem(pubPath, pub);
        Ed25519Pem.WritePrivateKeyPem(privPath, priv);

        log($"OK public: {pubPath}");
        log($"OK private: {privPath} (DO NOT COMMIT)");
    }

    public static void VerifyManifestAndSignature(string bundleDir, string? publicKeyPath, Action<string> log)
    {
        bundleDir = Path.GetFullPath(bundleDir);
        var manifestPath = Path.Combine(bundleDir, "manifest.json");
        var pkgPath = Path.Combine(bundleDir, "evidence-package.json");
        if (!File.Exists(manifestPath)) throw new FileNotFoundException(manifestPath);
        if (!File.Exists(pkgPath)) throw new FileNotFoundException(pkgPath);

        var manifestJson = File.ReadAllText(manifestPath, Encoding.UTF8);
        var pkg = JsonSerializer.Deserialize<Dictionary<string, object?>>(File.ReadAllText(pkgPath, Encoding.UTF8))!;
        var expectedHash = (string?)pkg["manifestHash"];
        var actualHash = Sha256Text(manifestJson);
        if (!string.Equals(expectedHash, actualHash, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException($"MANIFEST_HASH_MISMATCH expected={expectedHash} actual={actualHash}");
        log("OK manifestHash matches evidence-package.json");

        var manifestObj = JsonSerializer.Deserialize<Dictionary<string, object?>>(manifestJson)!;
        if (!manifestObj.TryGetValue("signature", out var sigObj) || sigObj is null)
        {
            log("OK manifest is not signed");
            return;
        }

        if (string.IsNullOrWhiteSpace(publicKeyPath))
        {
            log("WARN manifest is signed but no public key provided");
            return;
        }

        var sigMap = (JsonElement)sigObj;
        var keyId = sigMap.GetProperty("keyId").GetString();
        var alg = sigMap.GetProperty("alg").GetString();
        var value = sigMap.GetProperty("value").GetString();
        if (alg != "ed25519") throw new InvalidOperationException($"Unsupported alg: {alg}");

        // Remove signature field for canonical payload
        manifestObj.Remove("signature");
        var payloadJson = JsonSerializer.Serialize(manifestObj);

        var pubBytes = Ed25519Pem.ReadPublicKeyBytes(publicKeyPath);
        var algorithm = SignatureAlgorithm.Ed25519;
        var pk = PublicKey.Import(algorithm, pubBytes, KeyBlobFormat.RawPublicKey);
        var ok = algorithm.Verify(pk, Encoding.UTF8.GetBytes(payloadJson), Convert.FromBase64String(value!));
        if (!ok) throw new InvalidOperationException("SIGNATURE_INVALID");
        log($"OK signature verified keyId={keyId}");
    }

    public static void VerifyBundleHashes(string manifestPath, Action<string> log)
    {
        manifestPath = Path.GetFullPath(manifestPath);
        var bundleDir = Path.GetDirectoryName(manifestPath)!;
        var manifest = JsonSerializer.Deserialize<Dictionary<string, object?>>(File.ReadAllText(manifestPath, Encoding.UTF8))!;

        if (!manifest.TryGetValue("items", out var itemsObj) || itemsObj is null)
            throw new InvalidOperationException("manifest.items missing");

        var items = (JsonElement)itemsObj;
        foreach (var item in items.EnumerateArray())
        {
            var evidenceId = item.GetProperty("evidenceId").GetString();
            var hash = item.GetProperty("hash").GetString();
            var storageRef = item.GetProperty("storageRef").GetString();

            var filePath = Path.GetFullPath(Path.Combine(bundleDir, storageRef!));
            // prevent traversal
            if (!filePath.StartsWith(bundleDir + Path.DirectorySeparatorChar))
                throw new InvalidOperationException("Path traversal blocked");

            var actual = MvpStore.Sha256File(filePath);
            if (!string.Equals(actual, hash, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException($"HASH_MISMATCH {evidenceId} expected={hash} actual={actual}");
            log($"OK {evidenceId} {storageRef}");
        }

        log("BUNDLE_VERIFY_OK");
    }

    private static string Sanitize(string s)
    {
        var sb = new StringBuilder();
        foreach (var ch in s)
        {
            if (char.IsLetterOrDigit(ch) || ch is '.' or '_' or '-') sb.Append(ch);
            else sb.Append('_');
        }
        return sb.ToString();
    }

    private static string Sha256Text(string txt)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(txt));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
