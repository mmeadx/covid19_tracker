console.log("Loaded app.js")


d3.json("https://api.covidtracking.com/v1/us/daily.json").then((data) => {
    
    console.log(data);
    
    // Get Today's Date and format --- https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date(data[0].dateChecked);
    var todays_date = today.toLocaleDateString("en-US", options);

    // Format numbers to have commas
    var death_comma = (data[0].death).toLocaleString('en');
    var death_today = death_comma;
    var pos_comma = (data[0].positive).toLocaleString('en');
    var hosp_comma = (data[0].hospitalizedCurrently).toLocaleString('en');
    var icu_comma = (data[0].inIcuCurrently).toLocaleString('en');
    var vent_comma = (data[0].onVentilatorCurrently).toLocaleString('en');
    var death_increase = data[0].deathIncrease;

    // NUMBERS FOR COUNTER AT TOP OF PAGE

    var todayhtml = d3.select("#todaysdate")
        .html(`${todays_date}`);

    var death_today = d3.select("#death_today")
        .append("h4")
        .classed('thin-text', true)   
        .html(`${death_comma}`);
    
    var deathcount = d3.select("#deathcounts")
        .append("h1")
        .classed('deathcount', true)
        .html(`${death_comma}`);

    var death_incr = d3.select("#death_incr")
        .append("h3")
        .classed('death_incr', true)
        .html(`+ ${death_increase}`);
 
    var positive_today = d3.select("#positive_today")
        .append("h4")
        .classed('thin-text', true)   
        .html(`${pos_comma}`);

    var hosp_today = d3.select("#hosp_today")
        .append("h4")
        .classed('thin-text', true)   
        .html(`${hosp_comma}`);

    var icu_today = d3.select("#icu_today")
        .append("h4")
        .classed('thin-text', true)   
        .html(`${icu_comma}`);

    var vent_today = d3.select("#vent_today")
        .append("h4")
        .classed('thin-text', true)   
        .html(`${vent_comma}`);
});





