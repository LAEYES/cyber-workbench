# Catalog imports (reproductibles)

Objectif : importer des référentiels **sans dépendre** de copier/coller manuel.
Par défaut, les imports distants lisent `catalog/sources.yml` et vérifient `sha256` si disponible.
Les sources marquées `allowDynamic: true` nécessitent `--allow-dynamic`.

## NIST CSF 2.0 (public)
### Mode le plus sûr : import depuis CSV (export local depuis l’xlsx officiel)
1) Télécharge l’xlsx officiel depuis NIST (CSF Reference Tool export)
2) Ouvre-le et **enregistre en CSV** la feuille **"CSF 2.0"**
3) Importe le CSV :

```bash
npx tsx src/cli.ts catalog:import-nist --in ./inputs/nist-csf-2.0.csv --out ./catalog/controls/nist-csf-2.0.outcomes.yml
```

### Import direct XLSX (moins reproductible)
Par défaut, la CLI lit `catalog/sources.yml`. Si la source est `allowDynamic: true`, il faut expliciter :

```bash
npx tsx src/cli.ts catalog:import-nist-xlsx --allow-dynamic
```

Pour un import **reproductible**, pinnez l’xlsx dans `catalog/sources.yml` (ajout `sha256` + `retrievedAt`) et retirez `allowDynamic`.

## ISO/IEC 27002:2022 (copyright)
On ne stocke pas le texte officiel dans le repo.
On importe **les IDs + métadonnées** depuis un fichier local CSV que vous fournissez.

Exemple de template : `docs/examples/iso27002-2022.template.csv`

### Format d'entrée recommandé (CSV UTF-8)
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
Même principe : import depuis un fichier local CSV.

Exemple de template : `docs/examples/cis-v8.template.csv`

### Format d'entrée recommandé (CSV UTF-8)
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
