console.log("Loaded app.js")


d3.json("https://api.covidtracking.com/v1/us/daily.json").then((data) => {

    console.log(data);

    // Get Today's Date and format --- https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date(data[0].dateChecked);
    var todays_date = today.toLocaleDateString("en-US", options);

    // Format numbers to have commas
    var death_comma = (data[0].death).toLocaleString('en');
    var death_today = death_comma;
    var pos_comma = (data[0].positive).toLocaleString('en');
    var hosp_comma = (data[0].hospitalizedCurrently).toLocaleString('en');
    var hosp_cur = (data[0].hospitalizedCurrently).toLocaleString('en');
    var hospIncrease = (data[0].hospitalizedIncrease).toLocaleString('en');
    var icu_comma = (data[0].inIcuCurrently).toLocaleString('en');
    var vent_comma = (data[0].onVentilatorCurrently).toLocaleString('en');
    var death_increase = data[0].deathIncrease;
    var new_pos = (data[0].positiveIncrease).toLocaleString('en');


    // if/else statement to determine + or -
    if (data[0].hospitalizedIncrease > 0) {
        var hospIncreaseStatus = `+ ${hospIncrease}`
    }

    else {
        var hospIncreaseStatus = `- ${hospIncrease}`
    }

    // NUMBERS FOR COUNTER AT TOP OF PAGE

    var todayhtml = d3.select("#todaysdate")
        .html(`${todays_date}`);

    var death_today = d3.select("#death_today")
        .append("h4")
        .classed('thin-text', true)
        .html(`${death_comma}`);

    var deathcount = d3.select("#deathcounts")
        .append("h1")
        .classed('newPos', true)
        .html(`${death_comma}`);

    var death_incr = d3.select("#death_incr")
        .append("h6")
        .classed('death_incr', true)
        .html(`+ ${death_increase}`);

    var positive_today = d3.select("#positive_today")
        .append("h4")
        .classed('thin-text', true)
        .html(`${pos_comma}`);

    var newPositive = d3.select("#newPos")
        .append("h1")
        .classed('newPos', true)
        .html(`${new_pos}`)

    var hosp_today = d3.select("#hosp_today")
        .append("h4")
        .classed('thin-text', true)
        .html(`${hosp_comma}`);

    var hosp_currently = d3.select("#hospCur")
        .append("h1")
        .classed('newPos', true)
        .html(`${hosp_cur}`);

    var hospIncr = d3.select("#hospIncr")
        .append("h6")
        .classed('hosp_incr', true)
        .html(hospIncreaseStatus);

    var icu_today = d3.select("#icu_today")
        .append("h4")
        .classed('thin-text', true)
        .html(`${icu_comma}`);

    var icu_today_index = d3.select("#icu_index")
        .append("h1")
        .classed('newPos', true)
        .html(`${icu_comma}`);

    var vent_today = d3.select("#vent_today")
        .append("h4")
        .classed('thin-text', true)
        .html(`${vent_comma}`);



        // ----- LINE GRAPH -----
     
var total_death = {
    x: (data.map(x => x.dateChecked)).reverse(),
    y: (data.map(x => x.death)).reverse(),
    name: "Total Deaths",
    type: "line",
    marker: {
        color: "#b91922"
    }
};

var total_hosp = {
    x: (data.map(x => x.dateChecked)).reverse(),
    y: (data.map(x => x.hospitalizedCurrently)).reverse(),
    name: "Hospitalized Currently",
    type: "line",
    marker: {
        color: "#0b326a"
    }
};

var total_icu = {
    x: (data.map(x => x.dateChecked)).reverse(),
    y: (data.map(x => x.inIcuCurrently)).reverse(),
    name: "In ICU",
    type: "line",
    marker: {
        color: "#074e3d"
    }
};


var lineData = [total_death, total_hosp, total_icu];

var lineLayout = {
    xaxis: {
        dtick: '120',
        showgrid: false
    },
    title: `USA Covid Numbers Over Time`,
    margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
    },
    legend: {
        "orientation": "h",
        x: .75,
        xanchor: 'right',
        y: 1
    }
}

var config = {responsive: true};

Plotly.newPlot("covidTotals", lineData, lineLayout, config);



});







