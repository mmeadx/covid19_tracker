const url = "https://api.covidtracking.com";

// Set up variables to take in States
var usaOverall = "/v1/us/daily.json"
var state = "mn"
var stateDaily = `/v1/states/${state}/daily.json`

var current = d3.json(url + stateDaily).then(function(data) {
    console.log(data);
})
