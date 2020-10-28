console.log("Loaded app-cal-death.js")

d3.json("https://api.covidtracking.com/v1/us/daily.json").then(function (sample) {
    

// console.log(sample); //Check to see if we're getting data


    sample.sort((a, b) => new Date(a.dateChecked) - new Date(b.dateChecked));

    const dateValues = sample.map(dv => ({
        date: d3.timeDay(new Date(dv.dateChecked)),
        value: Number(dv.deathIncrease)
    }));

    const svg = d3.select("#svg");
    // const { width, height } = document
    //     .getElementById("svg")
    //     .getBoundingClientRect();


    function draw() {
        const years = d3
        .nest()
        .key(d => d.date.getUTCFullYear())
        .entries(dateValues)
        .reverse();

        const month = d3.nest()
        .key(d => d.date.getUTCMonth())
        .entries(dateValues)
        .reverse();

        // console.log(month); // Test to see if it grabs month

        const values = dateValues.map(c => c.value);
        const maxValue = d3.max(values);
        const minValue = d3.min(values);

        const cellSize = 15;
        const yearHeight = cellSize * 7;
        // const monthHeight = cellSize * 30;

        const group = svg.append("g");

        const year = group
        .selectAll("g")
        .data(years)
        .join("g")
        .attr(
            "transform",
            (d, i) => `translate(${i}, ${yearHeight * i + cellSize * 1.5})`
        );

        year
        .append("text")
        .attr("x", -45)
        .attr("y", -70)
        .attr("text-anchor", "end")
        .attr("font-size", 12)
        .attr("font-weight", "lighter")
        .attr("transform", "rotate(270)")
        .text(d => d.key);

        const formatDay = d =>
        ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][d.getUTCDay()];
        const countDay = d => d.getUTCDay();
        const timeWeek = d3.utcSunday;
        const formatDate = d3.utcFormat("%x");
        const colorFn = d3
        .scaleSequential(d3.interpolateReds )
        .domain([Math.floor(minValue), Math.ceil(maxValue)]);
        const format = d3.format("+.2%");

        year
        .append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(d3.range(7).map(i => new Date(2020, 0, i)))
        .join("text")
        .attr("x", 40)
        .attr("y", d => (countDay(d) + .5) * cellSize)
        .attr("dy", "0.31em")
        .attr("font-size", 10) // added
        .attr("font-weight", "lighter") // added
        .text(formatDay);

        year
        .append("g")
        .selectAll("rect")
        .data(d => d.values)
        .join("rect")
        .attr("width", cellSize - 1.5)
        .attr("height", cellSize - 1.5)
        .attr(
            "x",
            (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10
        )
        .attr("y", d => countDay(d.date) * cellSize + 0.5)
        .attr("fill", d => colorFn(d.value))
        .append("title")
        .text(d => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);

        const categoriesCount = 10;
        const categories = [...Array(categoriesCount)].map((_, i) => {
        const upperBound = (maxValue / categoriesCount) * (i + 1);
        const lowerBound = (maxValue / categoriesCount) * i;

        return {
            upperBound,
            lowerBound,
            color: d3.interpolateBuGn(upperBound / maxValue),
            selected: true
        };
        });

        const legendWidth = 90;

        function toggle(legend) {
            const { lowerBound, upperBound, selected } = legend;

            legend.selected = !selected;

            const highlightedDates = years.map(y => ({
                key: y.key,
                values: y.values.filter(
                v => v.value > lowerBound && v.value <= upperBound
                )
        }));

        year
            .data(highlightedDates)
            .selectAll("rect")
            .data(d => d.values, d => d.date)
            .transition()
            .duration(0)
            .attr("fill", d => (legend.selected ? colorFn(d.value) : "white"));
        }

    }

    draw();

    

});
