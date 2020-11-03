console.log("Loaded app.js")


d3.json("https://api.covidtracking.com/v1/us/daily.json").then((data) => {
    
    console.log(data);
    
    // Get Today's Date and format --- https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date(data[0].dateChecked);
    var todays_date = today.toLocaleDateString("en-US", options);

    // Format numbers to have commas
    var death_comma = (data[0].death).toLocaleString('en');
    var pos_comma = (data[0].positive).toLocaleString('en');
    var hosp_comma = (data[0].hospitalizedCurrently).toLocaleString('en');
    var icu_comma = (data[0].inIcuCurrently).toLocaleString('en');
    var vent_comma = (data[0].onVentilatorCurrently).toLocaleString('en');

    // NUMBERS FOR COUNTER AT TOP OF PAGE

    var todayhtml = d3.select("#todaysdate")
        .html(`${todays_date}`);

    var death_today = d3.select("#death_today")
        .append("h4")
        .classed('thin-text', true)   
        .html(`${death_comma}`);
 
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


// FUNCTION FROM GOOGLE CHARTS TO MAKE DONUT PIE CHART

// function makePie() {
    
//     d3.json(url + usaOverall).then((usTotals) => {
        
//         google.charts.load("current", {packages:["corechart"]});
//         google.charts.setOnLoadCallback(drawChart);
//             function drawChart() {
//                 var data = google.visualization.arrayToDataTable([
//                 ['Number Title', 'Totals'],
//                 ['In Hospital',     (usTotals[0].hospitalizedCurrently)],
//                 ['In ICU',      (usTotals[0].inIcuCurrently)],
//                 ['On Ventilator',    (usTotals[0].onVentilatorCurrently)]
//                 ]);

//                 var options = {
//                 pieHole: 0.4,
//                 pieSliceText: 'none',
//                 legend: 'bottom'
//                 };

//                 var chart = new google.visualization.PieChart(document.getElementById('usaTotalsChart'));
//                 chart.draw(data, options);
//         }

//     });
//     };

//     makePie();


