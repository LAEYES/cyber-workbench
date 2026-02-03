# Mappings

Mappings are stored as YAML with the following principles:
- `items[].from` is one control in a framework
- `items[].to` is a list of related controls (1..n)
- `confidence`: low|medium|high
- `rationale`: short justification

Files:
- `iso27002_to_nist-csf.yml`
- `cis_to_iso_nist.yml`
