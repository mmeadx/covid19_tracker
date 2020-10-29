console.log("app-deathCal.js running")


  d3.json("https://api.covidtracking.com/v1/us/daily.json").then((data) => {
    
    // console.log(data); 

    data.sort((a, b) => new Date(a.dateChecked) - new Date(b.dateChecked));

    const dateValues = data.map(dv => ({
        date: d3.timeDay(new Date(dv.dateChecked)),
        value: Number(dv.deathIncrease)
    }));

    const svg = d3.select("#svgDeath");
    const { width, height } = document
        .getElementById("svgDeath")
        .getBoundingClientRect();


    function draw() {
        const years = d3
        .nest()
        .key(d => d.date.getUTCFullYear())
        .entries(dateValues)
        .reverse();

        const values = dateValues.map(c => c.value);
        const maxValue = d3.max(values);
        const minValue = d3.min(values);

        const cellSize = 15;
        const yearHeight = cellSize * 7;

        const group = svg.append("g");

        const year = group
        .selectAll("g")
        .data(years)
        .join("g")
        .attr(
            "transform",
            (d, i) => `translate(50, ${yearHeight * i + cellSize * 1.5})`
        );

        year
        .append("text")
        .attr("x", -5)
        .attr("y", -30)
        .attr("text-anchor", "end")
        .attr("font-size", 10)
        .attr("font-weight", "lighter")
        .attr("transform", "rotate(270)")
        .text(d => d.key);

        const formatDay = d =>
        ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][d.getUTCDay()];
        const countDay = d => d.getUTCDay();
        const timeWeek = d3.utcSunday;
        const formatDate = d3.utcFormat("%x");
        const colorFn = d3
        .scaleSequential(d3.interpolateReds)
        .domain([Math.floor(minValue), Math.ceil(maxValue)]);
        const format = d3.format("+.2%");

        year
        .append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(d3.range(7).map(i => new Date(2020, 0, i)))
        .join("text")
        .attr("x", -5)
        .attr("y", d => (countDay(d) + 0.5) * cellSize)
        .attr("dy", "0.31em")
        .attr("font-size", 10)
        .text(formatDay);

        year
        .append("g")
        .selectAll("rect")
        .data(d => d.values)
        .join("rect")
        .attr("width", cellSize - 4)
        .attr("height", cellSize - 4)
        .attr(
            "x",
            (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10
        )
        .attr("y", d => countDay(d.date) * cellSize + 0.5)
        .attr("fill", d => colorFn(d.value))
        .append("title")
        .text(d => `${formatDate(d.date)}: ${d.value.toFixed(0)}`);

        const legend = group
        .append("g")
        .attr(
            "transform",
            `translate(10, ${years.length * yearHeight + cellSize * 4})`
        );

        // Controls the legend count of categories
        const categoriesCount = 5;
        const categories = [...Array(categoriesCount)].map((_, i) => {
        const upperBound = (maxValue / categoriesCount) * (i + 1);
        const lowerBound = (maxValue / categoriesCount) * i;

        // Controls color of legend
        return {
            upperBound,
            lowerBound,
            color: d3.interpolateReds(upperBound / maxValue),
            selected: true
        };
        });

        // Legend width control
        const legendWidth = 60;

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
            .duration(700)
            .attr("fill", d => (legend.selected ? colorFn(d.value) : "#fff5f1"));
        }

        legend
        .selectAll("rect")
        .data(categories)
        .enter()
        .append("rect")
        .attr("fill", d => d.color)
        .attr("y", -35)
        .attr("x", (d, i) => legendWidth * i)
        .attr("width", legendWidth)
        .attr("height", 10)
        .on("click", toggle);

        legend
        .selectAll("text")
        .data(categories)
        .join("text")
        .attr("transform", "rotate(90)")
        .attr("y", (d, i) => -legendWidth * i)
        .attr("dy", -25)
        .attr("x", -20)
        .attr("text-anchor", "start")
        .attr("font-size", 10)
        .text(d => `${d.lowerBound.toFixed(0)} - ${d.upperBound.toFixed(0)}`);

        // LEGEND DESCRIPTION CONTROL

        legend
        .append("text")
        .attr("dy", -27)
        .attr("x", 305)
        .attr("font-size", 10)
        .attr("font-weight", "lighter")
        .text("DEATHS PER DAY");
    }

    draw();

  });
    
    