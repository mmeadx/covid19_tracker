// Load Statement
console.log("Loaded app-statecharts.js")

// URL BUILD FOR COVID TRACKING API
const url = "https://api.covidtracking.com";
const current = "/v1/states/current.json"


// EVENT HANDLER - install handler to grab dataset values
d3.selectAll("body").on("change", updateAll);

function updateAll() {
    var dropdownMenu = d3.select("#selDataset");

    var dataset = dropdownMenu.node().value;

    console.log(`State Selected: ${dataset}`); // Will run when new dropdown item is selected
    
    // Clear Data After Click
    var clearTable = d3.select("#dataQuality");
    clearTable.html("");
    var clearGrade = d3.select("#dataGrade");
    clearGrade.html("");

    // Run these functions every time new dropdown is selected
    buildPlots(dataset);
    numbers(dataset);
    makePie(dataset);

};


function buildPlots(info){
    console.log("")
    console.log(`'buildPlots' function running on ${info}`);
    

    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((meta) => {


        // Used to get full name of state + FIPS code
        d3.csv("/static/csv/states.csv").then((states) => {
            var stateFull = states.filter(x => x.state_abbr === info);

            // Grab selected Dataset from samples using Subject ID No. from dropdown
            var selectedData = meta.filter(x => x.state === info);
            console.log("")
            console.log(`Data for ${info}`);
            console.log(selectedData);
            var statePop = parseInt(stateFull[0].population); 
            console.log(`Population ${statePop}`);
            
            // MOVING AVG CALC? --- code from https://stackoverflow.com/questions/19981713/html5-js-chart-with-moving-average
            
            // var moveMean = [];

            // for (i = 0; i < selectedData.length; i++)
            // {  
            //     var mean = (selectedData[i].positiveIncrease + selectedData[i-1].positiveIncrease + selectedData[i+1].positiveIncrease)/3.0;
            //     console.log(mean);
            //     moveMean.push(mean);
            // }

            // console.log(moveMean);


        // ----- BAR CHART -----
     
            var pos_line = {
                x: selectedData.map(x => x.dateChecked),
                y: selectedData.map(x => x.positiveIncrease),
                name: "Daily Positive Cases",
                type: "line",
                marker: {
                    color: "#FFA85C"
                }
            };

            var death_line = {
                x: selectedData.map(x => x.dateChecked),
                y: selectedData.map(x => x.death),
                name: "Death",
                type: "line",
                marker: {
                    color: "#d93b0f"
                }
            };

            var hosp_line = {
                x: selectedData.map(x => x.dateChecked),
                y: selectedData.map(x => x.hospitalizedCurrently),
                name: "Hospitalized",
                type: "line",
                marker: {
                    color: "#002f75"
                }
            };

            var icu_line = {
                x: selectedData.map(x => x.dateChecked),
                y: selectedData.map(x => x.inIcuCurrently),
                name: "In ICU",
                type: "line",
                marker: {
                    color: "#13a808"
                }
            };

            var vent_line = {
                x: selectedData.map(x => x.dateChecked),
                y: selectedData.map(x => x.onVentilatorCurrently),
                name: "On Ventilator",
                type: "line",
                marker: {
                    color: "#824ecf"
                }
            };

            var barData = [pos_line, death_line, hosp_line, icu_line, vent_line];

            var barLayout = {
                title: `COVID 19 Numbers for ${stateFull[0].state}`,
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100
                }
            };

            Plotly.newPlot("bar", barData, barLayout);
        });
    });
};

function numbers(dataset) {
    console.log("");
    console.log(`Numbers function running on ${dataset}`)
    
    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((data) => {


        // CSV of States with Abbr and FIPS
        d3.csv("/static/csv/states.csv").then((states) => {
            var stateFull = states.filter(x => x.state_abbr === dataset)

            // console.log(stateFull); // Test to see if Full State Name is given
        
            var selectedData = data.filter(x => x.state === dataset);

            var quality = d3.select("#dataQuality")
                .append("h6")
                .classed("text-center", true)
                .html(`${stateFull[0].state} <br> DATA QUALITY GRADE`);
            
            var dataGrade = d3.select("#dataGrade")
                .append("h1")
                .classed("text-center grade", true)
                .html(`${selectedData[0].dataQualityGrade}`);

                // selectedData[0].dataQualityGrade
            
            
        });
    })
}

// GOOGLE CHARTS - DONUT GRAPH ---------->
// https://developers.google.com/chart/interactive/docs/gallery/piechart#donut

function makePie(dataset) {
    
    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((data) => {

        var selectedData = data.filter(x => x.state === dataset);
        
        google.charts.load("current", {packages:["corechart"]});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                ['Number Title', 'Totals'],
                ['Total Positive',     (selectedData[0].positive)],
                ['Total Deaths',      (selectedData[0].death)],
                ['Total Hospitalized',    (selectedData[0].hospitalized)]
                ]);

                var options = {
                pieHole: 0.2,
                pieSliceText: 'none'
                };

                var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                chart.draw(data, options);
        }

    });
    };


function init() {
    
    // Set up StateID array
    var stateID= []

    var select = d3.select("#selDataset");

    // Loops through States to get data
    d3.json(url + current).then((state) => {
        for (var i = 0; i < state.length; i++) {
           
           // STATE CODE FOR DROPDOWN 
           statecode = state[i].state;
           stateID.push(statecode);

        }

        // Print in Console to be sure we're getting data
        // console.log("States Added to Dropdown #1 & #2: ");
        // console.log(stateID);

        // Loop through stateID and append an option to the dropdown
        stateID.forEach((state) => {
            select.append("option").text(state).property("value", state);
        });

        // var firstState = stateID;
        
        updateAll();

    });
};

init();