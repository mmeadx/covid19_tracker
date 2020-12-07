// Load Statement
console.log("Loaded app-map.js")

// EVENT HANDLER - install handler to grab dataset values
d3.selectAll("body").on("change", updateInfo);

let _covidDataCache = undefined;

async function updateInfo() {
    var dropdownMenu = d3.select("#selDataset");

    var option = dropdownMenu.node().value;

    console.log(`Option Selected: ${option}`); // Will run when new dropdown item is selected

    updateMap(option)
}

// ---------- MAP START ----------
var myMap = L.map('map').setView([41, -99], 4);
// best with box 1200 x 750 px, placed in style.css

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

var link = "./static/js/us-states.geojson";

async function updateMap(option) {
    
    // Load in Covid Data from getCovidData() in app-dataGrab.js
    if(!_covidDataCache)
        _covidDataCache = await getCovidData();
    const covidData = _covidDataCache;

    // Test to see if all data is there
    // console.log(covidData); 
    // console.log(option); 
    
    async function initMap() {
        const globalDataPromise = covidData;
        const geojsonPromise = d3.json(link);
        console.log("Running map on option:", option);

        const globalData = await globalDataPromise;
        // console.log(globalData);

        // function chooseFill(state) {
        //     var color = "black";
        //     for (var x = 0; x < globalData.length; x++) {
        //         if (globalData[x].state === state) {
        //             var statename = globalData[x].state;
        //             var deathrate = globalData[x].death_per_100k;
        //         }
        //     }

        
    };

    initMap()
};




// SETS UP PAGE WITH OPTIONS DROPDOWN

function init() {
    
    // Set up Options array
    var selOptions= ['Deaths', 'Infections', 'Hospitalized']

    var select = d3.select("#selDataset");

    // Loop through Options array and append to the dropdown
    selOptions.forEach((options) => {
        select.append("option").text(options).property("value", options);
    });
        
    // Run on first option
    updateMap();

};


init();