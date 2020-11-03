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
    
    // Clear All Data After Click

    var cleardataQuality = d3.select("#dataQuality");
    cleardataQuality.html("");

    var cleardataGrade = d3.select("#dataGrade");
    cleardataGrade.html("");

    var clearPctInfected = d3.select("#pctInfected");
    clearPctInfected.html("");
    
    var clearPctInfectedState = d3.select("#pctInfectedState");
    clearPctInfectedState.html("");

    var clearStateAccount = d3.select("#stateAccount");
    clearStateAccount.html("");

    var clearTotalPct = d3.select("#totalPct");
    clearTotalPct.html("");

    var clearPctDeathToday = d3.select("#pctDeathToday");
    clearPctDeathToday.html("");

    var clearPctDeathState = d3.select("#pctDeathState");
    clearPctDeathState.html("");

    var clearStateAccountDead = d3.select("#stateAccountDead");
    clearStateAccountDead.html("");

    var clearTotalPctDead = d3.select("#totalPctDead");
    clearTotalPctDead.html("");

    // Run these functions every time new dropdown is selected
    buildPlots(dataset);
    numbers(dataset);
    // makePie(dataset);

};

let _covidDataCache = undefined;
async function buildPlots(info){
    console.log("")
    console.log(`'buildPlots' function running on ${info}`);
    

    //const [meta, states] = await d3.json("https://api.covidtracking.com/v1/states/daily.json");



    // Used to get full name of state + FIPS code
    if(!_covidDataCache)
        _covidDataCache = await getCovidData();
    const states = _covidDataCache;
    var stateFull = states.find(x => x.covidData[0].state === info);

    // Grab selected Dataset from samples using Subject ID No. from dropdown
    console.log("")
    console.log(`Data for ${info}`);
    console.log(stateFull);
    var statePop = parseInt(stateFull.population); 
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
        x: stateFull.covidData.map(x => x.cleanDate),
        y: stateFull.covidData.map(x => x.positiveIncrease),
        name: "Daily Positive Cases",
        type: "line",
        marker: {
            color: "#FFA85C"
        }
    };

    var death_line = {
        x: stateFull.covidData.map(x => x.cleanDate),
        y: stateFull.covidData.map(x => x.death),
        name: "Death",
        type: "line",
        marker: {
            color: "#d93b0f"
        }
    };

    var hosp_line = {
        x: stateFull.covidData.map(x => x.cleanDate),
        y: stateFull.covidData.map(x => x.hospitalizedCurrently),
        name: "Hospitalized",
        type: "line",
        marker: {
            color: "#002f75"
        }
    };

    var icu_line = {
        x: stateFull.covidData.map(x => x.cleanDate),
        y: stateFull.covidData.map(x => x.inIcuCurrently),
        name: "In ICU",
        type: "line",
        marker: {
            color: "#13a808"
        }
    };

    var vent_line = {
        x: stateFull.covidData.map(x => x.cleanDate),
        y: stateFull.covidData.map(x => x.onVentilatorCurrently),
        name: "On Ventilator",
        type: "line",
        marker: {
            color: "#824ecf"
        }
    };

    var barData = [pos_line, death_line, hosp_line, icu_line, vent_line];

    var barLayout = {
        title: `COVID 19 Numbers for `,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    Plotly.newPlot("bar", barData, barLayout);
};

// function numbers(dataset) {
//     console.log("");
//     console.log(`Numbers function running on `)
    
//     d3.json("https://api.covidtracking.com/v1/states/daily.json").then((data) => {


//         // CSV of States with Abbr and FIPS
//         d3.csv("../static/csv/states.csv").then((states) => {
//             var stateFull = states.filter(x => x.state_abbr === dataset)

//             // console.log(stateFull); // Test to see if Full State Name is given
        
//             var selectedData = data.filter(x => x.state === dataset);

//             var quality = d3.select("#dataQuality")
//                 .append("h6")
//                 .classed("text-center", true)
//                 .html(`${stateFull[0].state} <br> DATA QUALITY GRADE`);
            
//             var dataGrade = d3.select("#dataGrade")
//                 .append("h1")
//                 .classed("text-center grade", true)
//                 .html(`${selectedData[0].dataQualityGrade}`);

//                 // selectedData[0].dataQualityGrade
            
            
//         });
//     })
// }

// GOOGLE CHARTS - DONUT GRAPH ---------->
// https://developers.google.com/chart/interactive/docs/gallery/piechart#donut

// function makePie(dataset) {
    
//     d3.json("https://api.covidtracking.com/v1/states/daily.json").then((data) => {

//         var selectedData = data.filter(x => x.state === dataset);
        
//         google.charts.load("current", {packages:["corechart"]});
//             google.charts.setOnLoadCallback(drawChart);
//             function drawChart() {
//                 var data = google.visualization.arrayToDataTable([
//                 ['Number Title', 'Totals'],
//                 ['Total Positive',     (selectedData[0].positive)],
//                 ['Total Deaths',      (selectedData[0].death)],
//                 ['Total Hospitalized',    (selectedData[0].hospitalized)]
//                 ]);

//                 var options = {
//                 pieHole: 0.2,
//                 pieSliceText: 'none'
//                 };

//                 var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
//                 chart.draw(data, options);
//         }

//     });
//     };

    
// SETS UP PAGE WITH STATE DROPDOWN

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