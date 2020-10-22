const url = "https://api.covidtracking.com";

// Set up variables to take in States
var usaOverall = "/v1/us/daily.json"
var current = "/v1/states/current.json"
var currentOverall = "/v1/us/current.json"
var state = "mn"
var stateDaily = `/v1/states/${state}/daily.json`

d3.json(url + currentOverall).then((state) => {
    state.forEach(function(d) {
        var deaths = d3.select("#todaysnumbers")
            .append("h6")
            .html(`TOTAL US DEATHS:<br> ${d.death}`);

        var posTest = d3.select("#postest")
            .append("h6")
            .html(`TOTAL POSITIVE TESTS:<br> ${d.positive}`);

        var negTest = d3.select("#negtest")
            .append("h6")
            .html(`TOTAL NEGATIVE TESTS:<br> ${d.negative}`);
    });

    var today = d3.select("#todaysdate")
        .html(`${state[0].date}`);
});