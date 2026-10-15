// PARKED 2026-10-14 per Johnathan: 7th grade STEM Innovators module, not loaded by the app. Not Proof-reviewed.
// DRAFT 7th grade items, Forge 2026-10-14, awaiting Proof. Numbers come from the real Forecaster runs (default settings 89% vs 81% always-no; wider look 70%, 109 of 122 caught).
export const STEM_MISCONCEPTIONS={
 accuracy_only:"Accuracy alone can fool you. Also check what the model caught, what it missed, and its false alarms.",
 baseline:"Always compare to a baseline, like a model that just says \"no quake\" everywhere. Without one, you can't tell if your model is any good.",
 testsame:"A fair test uses data the model never saw. Testing on what it learned from only checks its memory.",
 onevar:"Change one setting at a time. If you change several at once, you can't tell which one made the difference."
};
export const STEM_ITEMS=[
{id:"s1",std:"3.4",q:"Your forecaster scores 89%. A model that just says \"no quake\" everywhere scores 81%. What does that tell you?",c:[["Your model is only somewhat better than always saying no",null],["89% means the model is nearly perfect",'accuracy_only'],["The 81% number doesn't matter",'baseline'],["You can't compare two models",'baseline']]},
{id:"s2",std:"3.4",q:"Why does the Forecaster learn from 2016–2020 but get tested on 2021–2025?",c:[["To see if it works on data it never saw",null],["Testing on the years it learned is fairer",'testsame'],["So it can memorize the answers",'testsame'],["The years you test on don't matter",'testsame']]},
{id:"s3",std:"3.5",q:"After one change, accuracy drops from 89% to 70%, but the model now catches 109 quake areas instead of 61. How should you describe this?",c:[["A trade-off: more quakes caught, more false alarms",null],["The change failed in every way",'accuracy_only'],["Only accuracy matters, so undo it",'accuracy_only'],["Next time, change every setting at once",'onevar']]},
{id:"s4",std:"3.5",q:"You want to prove your change improved the model. What should you do?",c:[["Change one setting, retest, and compare to your first run",null],["Change all the settings at once",'onevar'],["Skip the first run and just test the new one",'baseline'],["Test it on the years it learned from",'testsame']]}
];
export const STEM_STANDARDS=[
{code:"STEM Innovators 3.4",text:"Illustrate how the practices of science and engineering relate to the innovation process (developing and using models; analyzing and interpreting data)."},
{code:"STEM Innovators 3.5",text:"Apply science and engineering practices to improve the product in a measurable manner: design, produce, test, and analyze an improved product."}];
