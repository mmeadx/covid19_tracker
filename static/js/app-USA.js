console.log("app-USA.js loaded");


async function getCovidData(){

    // getting the APIs
    const url_covid = 'https://api.covidtracking.com/v1/us/daily.json';
    const url_state_population = 'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest';

    let [covid_data, {data: state_population_data}] = await Promise.all([
        d3.json(url_covid),
        d3.json(url_state_population),
    ]);

    console.log("FIRST DATA")
    console.log(covid_data)

    

}

getCovidData()

// US COVID-19 TOTALS
d3.json("https://api.covidtracking.com/v1/us/daily.json").then((usTotals) => {
    
    // COVID-19 TOTALS BY STATE
    d3.json("https://api.covidtracking.com/v1/states/current.json").then((byStateTotals) => {
        
        // POPULATION BY STATE - LAST LINE IS US TOTAL
        d3.csv("../static/csv/states.csv").then((statePopData) => {
            
            // TEST FOR DATA
            // console.log(usTotals); 
            // console.log(byStateTotals);
            // console.log(statePopData);

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
                x: (byStateTotals.map(x => x.death)),
                y: (byStateTotals.map(x => x.positive)),
                mode: 'markers',
                text: byStateTotals.map(x => x.state),
                marker: {
                    size: deathNorm,
                    color: byStateTotals.map(x => x.fips)
                }
            };

            var data = [bubble1];

            var layout = {
                title: 'COVID-19 Positive Cases per State v Deaths',
                xaxis: {
                    title: 'Deaths',
                },
                yaxis: {
                    title: 'Positive Cases'
                },
                height: 400,
                width: 800
            };

            Plotly.newPlot('bubble', data, layout);

        });
        
    });
    
});
 