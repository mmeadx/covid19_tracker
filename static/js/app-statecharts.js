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
            var statePop = parseInt(stateFull.Population); 
            console.log(`Population ${statePop}`);


        // ----- LINE GRAPH -----
     
            var pos_line = {
                x: stateFull.covidData.map(x => x.cleanDate),
                y: stateFull.covidData.map(x => x.positiveIncreaseRollingAverage),
                name: "Daily Positive Cases (10 day rolling avg)",
                type: "line",
                marker: {
                    color: "#ec792b"
                }
            };

            var death_line = {
                x: stateFull.covidData.map(x => x.cleanDate),
                y: stateFull.covidData.map(x => x.death),
                name: "Death",
                type: "line",
                marker: {
                    color: "#b91922"
                }
            };

            var hosp_line = {
                x: stateFull.covidData.map(x => x.cleanDate),
                y: stateFull.covidData.map(x => x.hospitalizedCurrently),
                name: "Hospitalized",
                type: "line",
                marker: {
                    color: "#0b326a"
                }
            };

            var icu_line = {
                x: stateFull.covidData.map(x => x.cleanDate),
                y: stateFull.covidData.map(x => x.inIcuCurrently),
                name: "In ICU",
                type: "line",
                marker: {
                    color: "#074e3d"
                }
            };

            var vent_line = {
                x: stateFull.covidData.map(x => x.cleanDate),
                y: stateFull.covidData.map(x => x.onVentilatorCurrently),
                name: "On Ventilator",
                type: "line",
                marker: {
                    color: "#4c054a"
                }
            };

            var lineData = [pos_line, death_line, hosp_line, icu_line, vent_line];

            var lineLayout = {
                title: `COVID 19 Numbers for ${stateFull.State}`,
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100
                },
                legend: {
                    "orientation": "h",
                    x: "center",
                    y: "center"
                }
            }

            var config = {responsive: true};

            Plotly.newPlot("covidLine", lineData, lineLayout, config);
        };

// FUNCTION TO GIVE US NUMBERS

async function numbers(dataset) {
    console.log("");
    console.log(`Numbers function running on ${dataset}`)
    
    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((data) => {


        // CSV of States with Abbr and FIPS
        d3.csv("../static/csv/states.csv").then((states) => {
            var stateFull = states.filter(x => x.state_abbr === dataset)

            // console.log(stateFull); // Test to see if Full State Name is given
        
            var selectedData = data.filter(x => x.state === dataset);

            // Import US Totals
            d3.json("https://api.covidtracking.com/v1/us/daily.json").then((usTotals) => {

                // Calculate Percent Infected and Dead...
                var statePop = parseInt(stateFull[0].population);
                var totalInfected = selectedData[0].positive;
                var totalUsInfected = usTotals[0].positive;
                var totalDeath = selectedData[0].death;
                var totalUsDeath = usTotals[0].death;

                // ... in state
                var pctInfectedToday = (((totalInfected/statePop) * 100).toFixed(2))
                var pctDeathToday = (((totalDeath/statePop) * 100).toFixed(2))

                // ... of US Totals
                var totalOfUs = (((totalInfected/totalUsInfected) * 100).toFixed(2))
                var totalUSDeath = (((totalDeath/totalUsDeath) * 100).toFixed(2))

                // DATA QUALITY START
                // var quality = d3.select("#dataQuality")
                //     .append("h6")
                //     .classed("text-center", true)
                //     .html(`${stateFull[0].state} <br> DATA QUALITY GRADE`);
                
                // var dataGrade = d3.select("#dataGrade")
                //     .append("h1")
                //     .classed("text-center grade", true)
                //     .html(`${selectedData[0].dataQualityGrade}`);
                // DATA QUALITY END
                // STATE INFECTED START
                var pctInfected = d3.select("#pctInfected")
                    .append("h1")
                    .classed("text-center infected", true)
                    .html(`${pctInfectedToday}%`);
                
                var pctInfectedState = d3.select("#pctInfectedState")
                    .append("h6")
                    .classed("text-center", true)
                    .html(`of ${stateFull[0].state}'s <br> population has been infected`);
                // STATE INFECTED END
                // STATE v US INFECTED START
                var stateAccount = d3.select("#stateAccount")
                    .append("h6")
                    .classed("text-center", true)
                    .html(`${stateFull[0].state} accounts for`)

                var totalPct = d3.select("#totalPct")
                    .append("h1")
                    .classed("text-center", true)
                    .html(`${totalOfUs}%`)
                // STATE v US INFECTED END
                // STATE DEATH START
                var pctDead = d3.select("#pctDeathToday")
                    .append("h1")
                    .classed("text-center infected", true)
                    .html(`${pctDeathToday}%`);
                
                var pctDeadState = d3.select("#pctDeathState")
                    .append("h6")
                    .classed("text-center", true)
                    .html(`of ${stateFull[0].state}'s population <br> (${totalDeath} people) <br> have died from COVID-19`);
                // STATE DEATH END
                // STATE v US DEATH START
                var stateAccountDead = d3.select("#stateAccountDead")
                    .append("h6")
                    .classed("text-center", true)
                    .html(`${stateFull[0].state} accounts for`)

                var totalPctDead = d3.select("#totalPctDead")
                    .append("h1")
                    .classed("text-center", true)
                    .html(`${totalUSDeath}%`)
                // STATE v US DEATH END
            
            });
        });
    })
}

    
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