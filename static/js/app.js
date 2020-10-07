const url = "https://api.covidtracking.com";

// Set up variables to take in States
var usaOverall = "/v1/us/daily.json"
var current = "/v1/states/current.json"
var state = "mn"
var stateDaily = `/v1/states/${state}/daily.json`

d3.json(url +current).then((state) => {
    state.forEach(function(d) {
        var numbers = d3.select("#todaysnumbers")
            .append("h6")
            .html(`${d.state}: ${d.death}`);
    });

    var today = d3.select("#todaysdate")
        .html(`${state[0].date}`);
});


// INITIALIZE FUNCTION
function init() {

    var current = "/v1/states/current.json"
    var select = d3.select("#selDataset");

    // Set up StateID array
    var stateID= []

    // Loops through States to get data
    d3.json(url + current).then((state) => {
        for (var i = 0; i < state.length; i++) {
           
           // STATE CODE FOR DROPDOWN 
           statecode = state[i].state;
           stateID.push(statecode);

        }

        // Print in Console to be sure we're getting data
        console.log("States Added to Dropdown: ");
        console.log(stateID);

        // Loop through stateID and append an option to the dropdown
        stateID.forEach((state) => {
            select.append("option").text(state).property("value", state);
        });

        var firstState = stateID[0];
    });
};
init();

// var myMap = L.map("map", {
//     center: [44.97, -93.2650],
//     zoom: 14
//   });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
//   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   }).addTo(myMap);

//   console.log(myMap);

