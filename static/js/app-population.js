d3.json("https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest").then(function (pop_usa) {
    

    d3.json("https://api.covidtracking.com/v1/states/current.json").then(function (data) {
        var fips = pop_usa.data.map(x => x["ID State"]);

        fips2 = []
        for (var i = 0; i < fips.length; i++) {
            
            fips2.push(fips[i].slice(-2))
        }

        console.log(fips2);

        // console.log(pop_usa);
        // console.log(data);
    })
});