using System.Formats.Asn1;
using System.Text;

namespace NatoTrinityMvp;

public static class Ed25519Pem
{
    private const string OidEd25519 = "1.3.101.112";

    public static bool LooksLikePem(string text)
    {
        return text.Contains("-----BEGIN ", StringComparison.Ordinal);
    }

    public static byte[] ReadPrivateKeyBytes(string path)
    {
        var text = File.ReadAllText(path, Encoding.UTF8).Trim();
        if (!LooksLikePem(text))
            return Convert.FromBase64String(text);

        var der = ReadPemBlock(text, "PRIVATE KEY");
        return ParsePkcs8PrivateKey(der);
    }

    public static byte[] ReadPublicKeyBytes(string path)
    {
        var text = File.ReadAllText(path, Encoding.UTF8).Trim();
        if (!LooksLikePem(text))
            return Convert.FromBase64String(text);

        var der = ReadPemBlock(text, "PUBLIC KEY");
        return ParseSpkiPublicKey(der);
    }

    public static void WritePrivateKeyPem(string path, byte[] privateKey)
    {
        var der = BuildPkcs8PrivateKey(privateKey);
        WritePemBlock(path, "PRIVATE KEY", der);
    }

    public static void WritePublicKeyPem(string path, byte[] publicKey)
    {
        var der = BuildSpkiPublicKey(publicKey);
        WritePemBlock(path, "PUBLIC KEY", der);
    }

    private static byte[] ReadPemBlock(string text, string label)
    {
        var begin = $"-----BEGIN {label}-----";
        var end = $"-----END {label}-----";
        var start = text.IndexOf(begin, StringComparison.Ordinal);
        var stop = text.IndexOf(end, StringComparison.Ordinal);
        if (start < 0 || stop < 0 || stop <= start) throw new InvalidOperationException($"PEM block not found: {label}");

        var body = text.Substring(start + begin.Length, stop - (start + begin.Length));
        var b64 = new string(body.Where(c => !char.IsWhiteSpace(c)).ToArray());
        return Convert.FromBase64String(b64);
    }

    private static void WritePemBlock(string path, string label, byte[] der)
    {
        var b64 = Convert.ToBase64String(der);
        var sb = new StringBuilder();
        sb.AppendLine($"-----BEGIN {label}-----");
        for (var i = 0; i < b64.Length; i += 64)
        {
            var len = Math.Min(64, b64.Length - i);
            sb.AppendLine(b64.Substring(i, len));
        }
        sb.AppendLine($"-----END {label}-----");
        File.WriteAllText(path, sb.ToString(), Encoding.UTF8);
    }

    private static byte[] ParsePkcs8PrivateKey(byte[] der)
    {
        var reader = new AsnReader(der, AsnEncodingRules.DER);
        var seq = reader.ReadSequence();
        _ = seq.ReadInteger(); // version

        var alg = seq.ReadSequence();
        var oid = alg.ReadObjectIdentifier();
        if (!string.Equals(oid, OidEd25519, StringComparison.Ordinal))
            throw new InvalidOperationException($"Unsupported algorithm OID: {oid}");
        if (alg.HasData) alg.ReadNull();

        // RFC8410: privateKey is an OCTET STRING containing an OCTET STRING of the 32-byte seed.
        var outer = seq.ReadOctetString();

        // Try to unwrap inner OCTET STRING if present
        try
        {
            var innerReader = new AsnReader(outer, AsnEncodingRules.DER);
            var seed = innerReader.ReadOctetString();
            innerReader.ThrowIfNotEmpty();
            outer = seed;
        }
        catch
        {
            // keep outer as-is
        }

        seq.ThrowIfNotEmpty();
        reader.ThrowIfNotEmpty();
        return outer;
    }

    private static byte[] ParseSpkiPublicKey(byte[] der)
    {
        var reader = new AsnReader(der, AsnEncodingRules.DER);
        var seq = reader.ReadSequence();
        var alg = seq.ReadSequence();
        var oid = alg.ReadObjectIdentifier();
        if (!string.Equals(oid, OidEd25519, StringComparison.Ordinal))
            throw new InvalidOperationException($"Unsupported algorithm OID: {oid}");
        if (alg.HasData) alg.ReadNull();

        var key = seq.ReadBitString(out _);
        seq.ThrowIfNotEmpty();
        reader.ThrowIfNotEmpty();
        return key;
    }

    private static byte[] BuildPkcs8PrivateKey(byte[] privateKey)
    {
        // RFC8410: store seed as an inner OCTET STRING
        var inner = new AsnWriter(AsnEncodingRules.DER);
        inner.WriteOctetString(privateKey);
        var innerDer = inner.Encode();

        var writer = new AsnWriter(AsnEncodingRules.DER);
        writer.PushSequence();
        writer.WriteInteger(0);
        writer.PushSequence();
        writer.WriteObjectIdentifier(OidEd25519);
        writer.PopSequence();
        writer.WriteOctetString(innerDer);
        writer.PopSequence();
        return writer.Encode();
    }

    private static byte[] BuildSpkiPublicKey(byte[] publicKey)
    {
        var writer = new AsnWriter(AsnEncodingRules.DER);
        writer.PushSequence();
        writer.PushSequence();
        writer.WriteObjectIdentifier(OidEd25519);
        writer.PopSequence();
        writer.WriteBitString(publicKey);
        writer.PopSequence();
        return writer.Encode();
    }
}
