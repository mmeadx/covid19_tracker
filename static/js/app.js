const url = "https://api.covidtracking.com";

// Set up variables to take in States
var usaOverall = "/v1/us/daily.json"
var current = "/v1/states/current.json"
var state = "mn"
var stateDaily = `/v1/states/${state}/daily.json`

// CHARTS FUNCITON
function charts() {

};



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