# Catalog releases

This folder contains **catalog release snapshots**.

A release snapshot is a JSON file listing:
- the catalog file list
- file sizes
- sha256 hashes
- git commit/branch

Generate:

```bash
npm run catalog:release
```

Notes:
- Run `node scripts/pin-sources.mjs` before release if `catalog/sources.yml` URLs changed.
- Release snapshots are meant for audit/reproducibility.
