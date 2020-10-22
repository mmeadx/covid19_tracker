console.log("Loaded app.js")

const url = "https://api.covidtracking.com";

// Set up variables to take in States
var usaOverall = "/v1/us/daily.json"

d3.json(url + usaOverall).then((data) => {
    
    console.log(data);
    
    // Get Today's Date and format --- https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date(data[0].dateChecked);
    var todays_date = today.toLocaleDateString("en-US", options);

    // NUMBERS FOR COUNTER AT TOP OF PAGE

    var todayhtml = d3.select("#todaysdate")
        .html(`${todays_date}`);

    var death_today = d3.select("#death_today")
        .append("h6")
        .classed('thin-text', true)   
        .html(`${data[0].death}`);

    var positive_today = d3.select("#positive_today")
        .append("h6")
        .classed('thin-text', true)   
        .html(`${data[0].positive}`);

    var hosp_today = d3.select("#hosp_today")
        .append("h6")
        .classed('thin-text', true)   
        .html(`${data[0].hospitalizedCurrently}`);

    var icu_today = d3.select("#icu_today")
        .append("h6")
        .classed('thin-text', true)   
        .html(`${data[0].inIcuCurrently}`);

    var vent_today = d3.select("#vent_today")
        .append("h6")
        .classed('thin-text', true)   
        .html(`${data[0].onVentilatorCurrently}`);
});





