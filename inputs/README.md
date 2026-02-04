# Inputs pour les catalogues

Ce dossier contient les fichiers sources (CSV, XLSX) pour l'import des référentiels.

## NIST CSF 2.0
Le fichier XLSX original est requis pour la conversion mais ne peut pas être généré par l'IA (format binaire).

1. **Télécharger** : Récupérez le fichier "NIST CSF 2.0 Core (Excel)" depuis le site officiel :  
   [https://www.nist.gov/cyberframework](https://www.nist.gov/cyberframework)
2. **Placer** : Sauvegardez-le dans ce dossier sous le nom `nist-csf-2.0.xlsx`.
3. **Convertir** : Ouvrez le fichier Excel, sélectionnez l'onglet **"CSF 2.0"**, et faites "Enregistrer sous" > **CSV (UTF-8)** nommé `nist-csf-2.0.csv`.

## Commande d'import
Une fois le CSV présent :
```bash
npx tsx src/cli.ts catalog:import-nist --in ./inputs/nist-csf-2.0.csv --out ./catalog/controls/nist-csf-2.0.outcomes.yml
```