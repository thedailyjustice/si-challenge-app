# Fault Line Lab (working name)
New app for the 2027 Presidential SI Challenge, started 2026-10-14. Static files only: open via any static server (`python3 -m http.server`). No build step, no outside requests, no accounts, no names. Progress in localStorage key `faultline-v1`.
- js/items.js: practice items with misconception tags (DRAFT, needs Proof).
- js/coach.js: on-device Bayesian Knowledge Tracing + misconception counts.
- js/station.js: Quake Forecaster, k-nearest-neighbor model trained on real USGS M6+ quakes (data/usgs-m6-2016-2025.csv).
