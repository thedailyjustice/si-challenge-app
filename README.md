# Fault Line Lab (working name)
New app for the 2027 Presidential SI Challenge, started 2026-10-14. Static files only: open via any static server (`python3 -m http.server`). No build step, no outside requests, no accounts, no names.

- packs/8-ESS3-1.json: built-in 8th grade pack (8.ESS3.1). Item and feedback text signed off by Johnathan 2026-10-15; do not edit without a new sign-off.
- packs/test-stem-innovators-3-4-3-5.json: TEST pack for the Teacher upload screen only (draft 7th grade STEM Innovators 3.4/3.5, not Proof-reviewed). Not loaded by the app.
- packs/schema.json: JSON Schema for packs.
- js/packs.js: pack validation and on-device storage. js/coach.js: on-device Bayesian Knowledge Tracing + misconception counts.
- js/station.js: Quake Forecaster on real USGS M6+ quakes (data/usgs-m6-2016-2025.csv). Shown only when the 8.ESS3.1 pack is selected.
- parked/: parked 7th grade source (not loaded).

## Bring your standards (standard packs)
Teacher screen: load a `.json` file or paste JSON. The app checks it and, if valid, saves it only in this browser's localStorage. Pick a standard on Home; Practice and Coach use that pack.

```json
{
 "id": "my-pack-1", "code": "7.LS1.1", "title": "Cells", "text": "Standard wording...", "grade": "7",
 "items": [
  {"id": "c1", "q": "Question text?", "c": [["Right answer", null], ["Wrong answer", "tagA"], ["Another wrong answer", "tagB"]]}
 ],
 "misconceptions": {"tagA": "Feedback shown when a student picks a tagA answer.", "tagB": "..."}
}
```
Rules: all seven fields required; every item needs a unique `id`, a question `q` and at least 2 choices `c`; each choice is `[text, tag]`; exactly one choice per item has tag `null` (the correct answer); every other tag must be a key in `misconceptions`; the pack `id` must not match a pack already loaded. All pack text is shown as plain text (never HTML).

## Saved data (localStorage, this device only)
- `faultline-v2`: `{sel, packs:{<pack id>:{mastery, answered, mis, log}}, runs}`. Older `faultline-v1` progress is moved into the `8-ESS3-1` slot on first load.
- `faultline-packs`: uploaded packs.
"Clear my progress" removes all of these, including uploaded packs.
