// DRAFT items for 8.ESS3.1, written by Forge 2026-10-14. Status: awaiting Proof review.
// Each wrong choice carries a misconception tag (m) used by the on-device coach.
export const STANDARD={code:"8.ESS3.1",text:"Collect data, map, and describe patterns in the locations of volcanoes and earthquakes related to tectonic plate boundaries, interactions, and hotspots in order to forecast the locations and likelihoods of future events."};
export const MISCONCEPTIONS={
 random:"Thinks earthquakes happen randomly anywhere on Earth, not mostly along plate boundaries.",
 exact:"Thinks scientists can predict the exact day and place of an earthquake. They can only forecast likelihood over years.",
 hotspot:"Forgets hotspots: thinks every volcano must be at a plate boundary.",
 weather:"Thinks weather or climate causes earthquakes.",
 center:"Thinks plates are most active in their middles instead of at their edges.",
 intraplate:"Thinks earthquakes can only happen at plate edges. Some, like New Madrid, happen inside plates.",
 once:"Thinks a place that just had a big quake is now safe, or that past quakes don't tell us about future ones."
};
export const ITEMS=[
{id:"q1",q:"On a world map of the last 10 years of big earthquakes, where do most of the dots fall?",c:[["In belts along plate edges",null],["Spread evenly across all land and ocean",'random'],["Mostly in the middle of continents",'center'],["Mostly in places with hot weather",'weather']]},
{id:"q2",q:"Hawaii has active volcanoes but sits far from any plate boundary. What best explains this?",c:[["A hotspot: hot material rises from deep in the mantle under the plate",null],["Hawaii must secretly be on a plate boundary",'hotspot'],["Warm ocean water melts the rock",'weather'],["Volcanoes can form anywhere at random",'random']]},
{id:"q3",q:"A town sits right next to a plate boundary where many quakes happened in the past 100 years. What is the best forecast?",c:[["More quakes are likely there in coming decades",null],["An earthquake will happen there on a date scientists can name",'exact'],["It is safe now because the big quakes already happened",'once'],["Past quakes tell us nothing about the future",'random']]},
{id:"q4",q:"What can earthquake scientists honestly tell the public today?",c:[["The chance of a strong quake in an area over a span of years",null],["The exact day and hour of the next big quake",'exact'],["That quakes come after heavy rain",'weather'],["Nothing, because quakes are completely random",'random']]},
{id:"q5",q:"The Ring of Fire around the Pacific Ocean has many volcanoes and earthquakes. Why?",c:[["Its edges are plate boundaries where plates collide or sink under each other",null],["The Pacific Ocean is warmer than other oceans",'weather'],["The middle of the Pacific Plate is the most active part",'center'],["It is a coincidence",'random']]},
{id:"q6",q:"Memphis is near the New Madrid Seismic Zone, which had large quakes in 1811-1812. What should a forecaster conclude?",c:[["Future quakes are possible there, though rare",null],["No quake can happen there because it is not on a plate edge",'intraplate'],["The next quake there will happen in a year scientists already know",'exact'],["Because 200 years passed, the risk is now zero",'once']]},
{id:"d1",q:"On the map, Chile (on a plate edge) has many big quakes and Brazil (not on a plate edge) has almost none. What pattern does this show?",c:[["Quakes cluster at plate edges",null],["Bigger countries get fewer quakes",'random'],["Warmer countries get fewer quakes",'weather'],["Quakes are spread evenly",'random']]},
{id:"d2",q:"On the Quake Forecaster map, a line of dots runs down the middle of the Atlantic Ocean. What does that line most likely mark?",c:[["A plate boundary under the ocean",null],["The middle of a plate",'center'],["A path of storms",'weather'],["Random dots with no meaning",'random']]},
{id:"d3",q:"A map shows a chain of volcanoes in the middle of the Pacific Plate, getting older toward the northwest. What made them?",c:[["The plate moving over a hotspot",null],["A hidden plate boundary",'hotspot'],["Warm ocean currents",'weather'],["Chance",'random']]},
{id:"d4",q:"Region A had 40 quakes in 10 years. Region B had 2. Which forecast fits the data best?",c:[["Region A is more likely to have quakes soon",null],["Region B is due for a quake on a known date",'exact'],["Region A is safe now that it had so many",'once'],["Both regions have the same chance",'random']]}
];
