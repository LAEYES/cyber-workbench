# STD — D18 — Honeypot Deployment (network / host)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Placement
- Outside production, isolated segment, but reachable via plausible attack paths.
- No outbound Internet (except allowlisted SIEM/SOAR destinations).

## 2. Telemetry
- Logs: auth, commands, connections, file activity.
- Time sync (NTP).

## 3. Security
- No real credentials.
- Rotate images/instances quarterly.

## 4. Evidence
- Network diagram, configs, test logs.
