console.log("Loaded app-statecharts.js")


const url = "https://api.covidtracking.com";
const current = "/v1/states/current.json"

// EVENT HANDLER - install handler to grab dataset values

d3.selectAll("body").on("change", updateAll);

function updateAll() {
    var dropdownMenu = d3.select("#selDataset");
    var dropdownMenu2 = d3.select("#selDataset2");

    var dataset = dropdownMenu.node().value;
    var dataset2 = dropdownMenu2.node().value;

    console.log("States Selected:")
    console.log(dataset); // Will run when new dropdown item is selected
    console.log(dataset2) // Will run when new dropdown 2 item is selected
    
    buildPlots(dataset, dataset2);

};


function buildPlots(info, info2){
    console.log("buildPlots FUNCTION RUNNING");
    console.log("Dropdown 1:")
    console.log(info);
    console.log("Dropdown 2:")
    console.log(info2);

    d3.json("https://api.covidtracking.com/v1/states/daily.json").then((meta) => {

        console.log(`buildPlots on ${info} and ${info2}`);


        // Grab selected Dataset from samples using Subject ID No. from dropdown
        var selectedData = meta.filter(x => x.state === info);
        console.log(selectedData); // Test to be sure we're getting the right value
        var selectedData2 = meta.filter(x => x.state === info2);
        console.log(selectedData2); // Test to be sure we're getting the right value

        // console.log(selectedData[0])

        // ----- BAR CHART -----
     
        var bar1 = {
            x: selectedData.map(x => x.dateChecked),
            y: selectedData.map(x => x.positiveIncrease),
            name: selectedData[0].state,
            type: "line",
            marker: {
                color: "#FFA85C"
            }
        };

        var bar2 = {
            x: selectedData2.map(x => x.dateChecked),
            y: selectedData2.map(x => x.positiveIncrease),
            name: selectedData2[0].state,
            type: "line",
            marker: {
                color: "#d93b0f",
                text: selectedData
            }
        };

        var barData = [bar1, bar2];

        var barLayout = {
            title: "Death",
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




function init() {
    
    // Set up StateID array
    var stateID= []
    var stateID2 = []

    var select = d3.select("#selDataset");
    var select2 = d3.select("#selDataset2");

    // Loops through States to get data
    d3.json(url + current).then((state) => {
        for (var i = 0; i < state.length; i++) {
           
           // STATE CODE FOR DROPDOWN 
           statecode = state[i].state;
           stateID.push(statecode);
           stateID2.push(statecode)

        }

        // Print in Console to be sure we're getting data
        // console.log("States Added to Dropdown #1 & #2: ");
        // console.log(stateID);

        // Loop through stateID and append an option to the dropdown
        stateID.forEach((state) => {
            select.append("option").text(state).property("value", state);
        });

        stateID2.forEach((state) => {
            select2.append("option").text(state).property("value", state);
        });

        // var firstState = stateID;
        // var firstState2 = stateID2;

        // console.log(firstState2);
        
        updateAll();

    });
};

init();