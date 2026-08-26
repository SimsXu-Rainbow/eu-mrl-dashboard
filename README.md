# EU Pesticide MRL Dashboard

Interactive, offline-capable single-file dashboard for EU pesticide **Maximum Residue Levels (MRLs)** under **Regulation (EC) No 396/2005**, covering **176 active substances**.

## Live site

Once GitHub Pages is enabled, the dashboard is served at the repository Pages URL (`index.html` is the entry point).

## What it contains

| View | Content |
|---|---|
| Overview | KPI summary of substances, regulations and recent changes |
| Active substances | Per-substance EU approval status, approval expiry, legal basis, MRL regulation matrix |
| Change tracking | Substances with MRL or approval changes, filterable by year |
| Sources | The official data sources used and how each dashboard field maps to them |

Each substance opens a detail modal with a **regulation × crop** MRL matrix, where every regulation column is labelled *Proposed* / *Current* / *Historical* together with its vote and application dates.

## Data sources

| Source | Used for |
|---|---|
| EC DG SANTE datalake — pesticide residues MRL download | MRL values, regulation numbers, crop codes, applicability status |
| EU Pesticides Database (active substances) | Approval status, approval expiry date, legal basis |
| PAFF Committee — Phytopharmaceuticals section | Vote dates / adoption stage of MRL regulations |
| EUR-Lex / OJEU | Regulation numbers and adoption dates |
| EFSA Journal | Reasoned opinions behind MRL revisions |

## Language

Bilingual interface (中文 / EN). The language toggle sits in the top-right corner and the choice is persisted in `localStorage`.

## Technical notes

- Single self-contained HTML file, no build step, no external network calls at runtime.
- Approximately 9 MB uncompressed, about 1.8 MB over the wire after gzip.
- "Changes in the last 6 months" is computed at runtime from the MRL matrix vote/application dates, relative to the current date.

## Disclaimer

This dashboard is a working tool for regulatory tracking. It is **not** an official publication. For any regulatory decision, verify against the consolidated text of Regulation (EC) No 396/2005 and the relevant amending regulations in EUR-Lex.
