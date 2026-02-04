# Operations

## Validate
```bash
npx tsx src/cli.ts catalog:validate --root ./catalog
```

## Refresh (rebuild from sources)
```bash
npx tsx src/cli.ts catalog:refresh --root ./catalog --sources ./catalog/sources.yml
```
Notes:
- `--allow-dynamic` is required only if a source is marked `allowDynamic: true`.
- For fully reproducible refresh, pin the source with `sha256` in `catalog/sources.yml` and remove `allowDynamic`.

## Stats
```bash
npx tsx src/cli.ts catalog:stats --root ./catalog
```

## Exports
```bash
npx tsx src/cli.ts catalog:export-mapping-csv --in <mapping.yml> --out <file.csv> --mode long
npx tsx src/cli.ts catalog:score-attack-csf --top 5
```
