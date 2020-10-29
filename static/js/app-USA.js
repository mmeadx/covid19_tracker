console.log("app-USA.js loaded");

// US COVID-19 TOTALS
d3.json("https://api.covidtracking.com/v1/us/daily.json").then((usTotals) => {
    
    // COVID-19 TOTALS BY STATE
    d3.json("https://api.covidtracking.com/v1/states/current.json").then((byStateTotals) => {
        
        // POPULATION BY STATE - LAST LINE IS US TOTAL
        d3.csv("../static/csv/states.csv").then((statePopData) => {
            
            // TEST FOR DATA
            console.log(usTotals); 
            console.log(byStateTotals);
            console.log(statePopData);

            // ---- BUBBLE CHART ---

            // Normalize Data
            statePop = statePopData.map(x => x.population);
            stateDeath = byStateTotals.map(x => x.death)
            deathNorm = []
            
            for (var i = 0; i < stateDeath.length; i++) {
                
                norm = (stateDeath[i])/(parseInt(statePop[i]))*10000;
                deathNorm.push(norm);
            }

            console.log(deathNorm);

            var bubble1 = {
                x: (byStateTotals.map(x => x.positive)),
                y: (byStateTotals.map(x => x.death)),
                mode: 'markers',
                text: byStateTotals.map(x => x.state),
                marker: {
                    size: deathNorm,
                    color: byStateTotals.map(x => x.fips)
                }
            };

            var data = [bubble1];

            var layout = {
                title: 'COVID-19 Deaths vs. Positive Cases per State',
                xaxis: {
                    title: 'Positive Cases',
                },
                yaxis: {
                    title: 'Deaths'
                },
                height: 400,
                width: 800
            };

            Plotly.newPlot('bubble', data, layout);

        });
        
    });
    
});
 