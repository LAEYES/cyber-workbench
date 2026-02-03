using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace NatoTrinityMvp;

public sealed partial class MvpStore
{
    private (int total, int migrated) MigrateToChained(string filePath)
    {
        if (!File.Exists(filePath)) return (0, 0);

        var tmp = filePath + ".tmp";
        var backup = filePath + $".bak.{DateTime.UtcNow:yyyyMMddHHmmss}";

        var prev = "GENESIS";
        var total = 0;
        var migrated = 0;

        using (var outFs = new FileStream(tmp, FileMode.Create, FileAccess.Write, FileShare.None))
        using (var sw = new StreamWriter(outFs, Encoding.UTF8))
        {
            foreach (var line in File.ReadLines(filePath, Encoding.UTF8))
            {
                var l = line.Trim();
                if (l.Length == 0) continue;
                total++;

                JsonObject? obj;
                try
                {
                    obj = JsonNode.Parse(l) as JsonObject;
                }
                catch
                {
                    // skip invalid lines (still count total)
                    continue;
                }

                if (obj is null) continue;

                // Remove existing chain fields if any (we rebuild a fresh chain)
                obj.Remove("hash");
                obj.Remove("prevHash");

                // Ensure minimal fields exist
                if (obj["timestamp"] is null)
                    obj["timestamp"] = DateTime.UtcNow.ToString("O");

                // Compute chained hash with canonical form
                obj["prevHash"] = prev;
                var canonical = CanonicalJson(obj);
                var hash = Sha256Hex(prev + "\n" + canonical);
                obj["hash"] = hash;

                sw.WriteLine(obj.ToJsonString(new JsonSerializerOptions { WriteIndented = false }));

                prev = hash;
                migrated++;
            }
        }

        // Replace atomically-ish: keep backup
        File.Move(filePath, backup, overwrite: true);
        File.Move(tmp, filePath, overwrite: true);

        return (total, migrated);
    }
}
