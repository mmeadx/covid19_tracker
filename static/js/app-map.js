// EVENT HANDLER - install handler to grab dataset values

d3.selectAll("body").on("change", updateInfo);

async function updateInfo() {
    var dropdownMenu = d3.select("#selDataset");

    var option = dropdownMenu.node().value;

    console.log("----------")
    console.log(`Option Selected: ${option}`); // Will run when new dropdown item is selected

    initMap(option) // Passes selected option to updateMap Function
}


var myMap = L.map('map').setView([41, -111], 4);
// best with box 1200 x 750 px, placed in style.css


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

var link = "../static/js/us-states.geojson";

async function initMap(choice) {
    const globalDataPromise = d3.json("https://api.covidtracking.com/v1/states/current.json");
    const geojsonPromise = d3.json(link);

    const globalData = await globalDataPromise;
    console.log(globalData);
    console.log("Running on " + choice);

    function chooseFill(state) {
        var color = "black";
        for (var x = 0; x < globalData.length; x++) {
            if (globalData[x].fips === state) {
                var statename = globalData[x].state;
                var deathrate = globalData[x].death;
            }
        }
        console.log(statename);
        console.log(deathrate);
        // console.log(hospitalized);

        // Low deathrate: low, medium, high positive rates
        if (deathrate < 500) {
                color = "#dddddd";
            }
            else if (deathrate > 500) {
                color = "red";
            }
            else {
                color = "black";
            }
        

        console.log(color);

        return color;
    }
    
    function pullDeaths(state) {
        var deathrate = 0;
    
        for (var x = 0; x < globalData.length; x++) {
            if (globalData[x].fips === state) {
                var deathrate = globalData[x].death;
            }
        }
        return deathrate;
    }

    function pullPosits(state) {
        var positrate = 0;
    
        for (var x = 0; x < globalData.length; x++) {
            if (globalData[x].fips === state) {
                var positrate = globalData[x].hospitalized;
            }
        }
        return positrate;
    }

  


    const data = await geojsonPromise;

    L.geoJson(data, {

        style: function (feature) {
            console.log(data);
            return {
                color: "white",
                fillColor: chooseFill(feature.id),
                fillOpacity: 1,
                weight: 0.75
            };
        },
        onEachFeature: function (feature, layer) {
            layer.on({
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        color: "red",
                        weight: 3,
                    });
                },

                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        color: "white",
                        weight: 0.75
                    });
                },

            });
            layer.bindPopup("<h5>" + feature.id + "</h5><hr><h6>Deaths per 100k: " + pullDeaths(feature.id) + "<br>Positives per 100k: "+ pullPosits(feature.id))
        }

    }).addTo(myMap);


}


initMap();

// var legend = L.control({position: "topleft"});
//     legend.onAdd = function(map) {
//         var div = L.DomUtil.create("div", "info legend"),
//         grades = [],
//         labels = []
//         div.innerHTML += '<img src="/static/images/choropleth-legend.png" width="120" height="150">'
//         return div;
//     };
// legend.addTo(myMap);

// function init() {

//     // Set up Options array
//     var selOptions = ['death', 'positive', 'hospitalized']

//     var select = d3.select("#selDataset");

//     // Loop through Options array and append to the dropdown
//     selOptions.forEach((options) => {
//         select.append("option").text(options).property("value", options);
//     });

//     // Run on first option
//     initMap(selOptions[0]);

// };

// init();



