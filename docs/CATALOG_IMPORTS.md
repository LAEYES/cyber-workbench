# Catalog imports (reproductibles)

Objectif : importer des référentiels **sans dépendre** de copier/coller manuel.

## NIST CSF 2.0 (public)
- Import automatique depuis l'export officiel (xlsx) :

```bash
npx tsx src/cli.ts catalog:import-nist --out ./catalog/controls/nist-csf-2.0.outcomes.yml
```

## ISO/IEC 27002:2022 (copyright)
On ne stocke pas le texte officiel dans le repo.
On importe **les IDs + métadonnées** depuis un fichier local que vous fournissez.

### Format d'entrée recommandé (CSV)
Colonnes :
- `id` (ex: `A.5.1`)
- `domain` (`org|people|phys|tech`)
- `title_short` (titre court, non-verbatim si besoin)
- `tags_domains` (ex: `D01;D02`)
- `tags_cia` (ex: `C;I;A`)
- `tags_type` (ex: `prevent;detect`)

Import :
```bash
npx tsx src/cli.ts catalog:import-iso --in ./inputs/iso27002-2022.csv --out ./catalog/controls/iso27002-2022.controls.yml
```

## CIS Controls v8 (copyright)
Même principe : import depuis un fichier local.

### Format d'entrée recommandé (CSV)
Colonnes :
- `id` (ex: `5.1` pour safeguard ou `5` pour control)
- `level` (`control|safeguard`)
- `ig` (`IG1;IG2;IG3`)
- `title_short`
- `tags_domains`, `tags_cia`, `tags_type`

Import :
```bash
npx tsx src/cli.ts catalog:import-cis --in ./inputs/cis-v8.csv --out ./catalog/controls/cis-v8.safeguards.yml
```

## Notes
- Ces imports sont **idempotents** : relancer régénère le même YAML.
- Les mappings doivent être faits dans `catalog/mappings/*.yml` et validés via `catalog:validate`.
