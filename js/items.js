// DRAFT items for 8.ESS3.1, written by Forge 2026-10-14. Status: awaiting Proof review.
// Each wrong choice carries a misconception tag (m) used by the on-device coach.
export const STANDARD={code:"8.ESS3.1",text:"Collect data, map, and describe patterns in the locations of volcanoes and earthquakes related to tectonic plate boundaries, interactions, and hotspots in order to forecast the locations and likelihoods of future events."};
export const MISCONCEPTIONS={
 random:"It's easy to think quakes can happen anywhere, but most happen in long belts along plate boundaries.",
 exact:"No one can predict the exact day of a quake. Scientists forecast the chance of one over many years.",
 hotspot:"Not every volcano is at a plate boundary. Some, like Hawaii's, form over a hotspot deep in the mantle.",
 weather:"Weather doesn't cause quakes or volcanoes. They come from plates moving deep underground.",
 center:"Plates are most active at their boundaries, where they meet, not in their middles.",
 intraplate:"Most quakes happen at plate boundaries, but some, like New Madrid near Memphis, happen far from any plate boundary.",
 once:"A big quake doesn't make a place safe. Places with many past quakes are likely to have more."
};
export const ITEMS=[
{id:"q1",q:"On a world map of the last 10 years of big earthquakes, where do most of the dots fall?",c:[["In belts along plate boundaries",null],["Spread evenly across all land and ocean",'random'],["Mostly in the middle of continents",'center'],["Mostly in places with hot weather",'weather']]},
{id:"q2",q:"Hawaii has active volcanoes but sits far from any plate boundary. What best explains this?",c:[["A hotspot: hot material rises from deep in the mantle under the plate",null],["Hawaii must secretly be on a plate boundary",'hotspot'],["Warm ocean water melts the rock",'weather'],["Volcanoes can form anywhere at random",'random']]},
{id:"q3",q:"A town sits right next to a plate boundary where many quakes happened in the past 100 years. What is the best forecast?",c:[["More quakes are likely there in coming decades",null],["An earthquake will happen there on a date scientists can name",'exact'],["It is safe now because the big quakes already happened",'once'],["Past quakes tell us nothing about the future",'random']]},
{id:"q4",q:"What can earthquake scientists honestly tell the public today?",c:[["The chance of a strong quake in an area over a span of years",null],["The exact day and hour of the next big quake",'exact'],["That quakes come after heavy rain",'weather'],["Nothing, because quakes are completely random",'random']]},
{id:"q5",q:"The Ring of Fire around the Pacific Ocean has many volcanoes and earthquakes. Why?",c:[["Its edges are plate boundaries where plates collide or sink under each other",null],["The Pacific Ocean is warmer than other oceans",'weather'],["The middle of the Pacific Plate is the most active part",'center'],["It is a coincidence",'random']]},
{id:"q6",q:"Memphis is near the New Madrid Seismic Zone, which had large quakes in 1811-1812. What should a forecaster conclude?",c:[["Future quakes are possible there, though rare",null],["No quake can happen there because it is not on a plate boundary",'intraplate'],["The next quake there will happen in a year scientists already know",'exact'],["Because 200 years passed, the risk is now zero",'once']]},
{id:"d1",q:"On the map, Chile (on a plate boundary) has many big quakes and Brazil (not on a plate boundary) has almost none. What pattern does this show?",c:[["Quakes cluster at plate boundaries",null],["Bigger countries get fewer quakes",'random'],["Warmer countries get fewer quakes",'weather'],["Quakes are spread evenly",'random']]},
{id:"d2",q:"A world map of all earthquakes shows a line of dots running down the middle of the Atlantic Ocean. What does that line most likely mark?",c:[["A plate boundary under the ocean",null],["The middle of a plate",'center'],["A path of storms",'weather'],["Random dots with no meaning",'random']]},
{id:"d3",q:"A map shows a chain of volcanoes in the middle of the Pacific Plate, getting older toward the northwest. What made them?",c:[["The plate moving over a hotspot",null],["A hidden plate boundary",'hotspot'],["Warm ocean currents",'weather'],["Chance",'random']]},
{id:"d4",q:"Region A had 40 quakes in 10 years. Region B had 2. Which forecast fits the data best?",c:[["Region A is more likely to have quakes in the coming years",null],["Region B is due for a quake on a known date",'exact'],["Region A is safe now that it had so many",'once'],["Both regions have the same chance",'random']]}
];
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
