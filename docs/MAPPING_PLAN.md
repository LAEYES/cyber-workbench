# Mapping plan (CSF ↔ 800-53, CSF ↔ ATT&CK)

## CSF → NIST SP 800-53 (exhaustif, reproductible)
Source: NIST CSF 2.0 Reference Tool export (xlsx) contains "Informative References" with SP 800-53 IDs.

Command:
```bash
npx tsx src/cli.ts catalog:import-nist-xlsx --out-map-80053 ./catalog/mappings/nist-csf-2.0_to_nist-800-53-r5.yml
```
Note: if the source is marked `allowDynamic: true`, pass `--allow-dynamic`.

## CSF ↔ MITRE ATT&CK
There is no universally official 1:1 crosswalk between CSF outcomes and ATT&CK techniques.
Approaches:
1) Heuristic mapping (keywords, tags) — low confidence
2) Use intermediate layers (e.g., ATT&CK mitigations → 800-53 controls) then link to CSF via CSF→800-53 — better, but requires importing mitigations + relationships from STIX.

Next implementation: extend ATT&CK import to include mitigations and relationships (DONE), then generate a first ATT&CK→CSF heuristic mapping (DONE). A stronger method is to generate ATT&CK→800-53 (via mitigations/relationships and an official crosswalk if available) then derive ATT&CK→CSF.
