console.log("Loaded app-statecharts.js")


const url = "https://api.covidtracking.com";
const current = "/v1/states/current.json"

// EVENT HANDLER - install handler to grab dataset values

d3.selectAll("body").on("change", updateAll);

function updateAll() {
    var dropdownMenu = d3.select("#selDataset");


    var dataset = dropdownMenu.node().value;

    console.log("States Selected:")
    console.log(dataset); // Will run when new dropdown item is selected
    
    var clearTable = d3.select("#dataquality");
    clearTable.html("");

    buildPlots(dataset);
    numbers(dataset);

};


function buildPlots(info){
    console.log("buildPlots FUNCTION RUNNING");
    console.log("Dropdown 1:")
    console.log(info);
    

    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((meta) => {

        console.log(`buildPlots on ${info}`);


        // Grab selected Dataset from samples using Subject ID No. from dropdown
        var selectedData = meta.filter(x => x.state === info);
        console.log(selectedData); // Test to be sure we're getting the right value
        
        // console.log(selectedData[0])

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
            title: `COVID 19 Numbers for ${selectedData[0].state}`,
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              }
        };

        Plotly.newPlot("bar", barData, barLayout);

    })
};

function numbers(dataset) {

    console.log(`Numbers function running on ${dataset}`)
    
    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((data) => {

        var selectedData = data.filter(x => x.state === dataset);

        var quality = d3.select("#dataquality")
            .append("h6")
            .html(`${selectedData[0].state} DATA QUALITY GRADE: ${selectedData[0].dataQualityGrade}`);
        
    })
}


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