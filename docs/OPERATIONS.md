# Operations

## Validate
```bash
npx tsx src/cli.ts catalog:validate --root ./catalog
```

## Refresh (rebuild from sources)
```bash
npx tsx src/cli.ts catalog:refresh --root ./catalog --sources ./catalog/sources.yml
```

## Stats
```bash
npx tsx src/cli.ts catalog:stats --root ./catalog
```

## Exports
```bash
npx tsx src/cli.ts catalog:export-mapping-csv --in <mapping.yml> --out <file.csv> --mode long
npx tsx src/cli.ts catalog:score-attack-csf --top 5
```
