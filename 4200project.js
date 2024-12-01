d3.csv("bike_sharing_dataset.csv").then(function(data) {
    // convert string values to numbers
    data.forEach(function(d) {
        d.temp_max = +d.temp_max; 
        d.total_cust = +d.total_cust;
    });

    // dimensions and margins for the SVG
    const margin = { top: 50, right: 30, bottom: 40, left: 80 }; 
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // create the SVG container
    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // input slider for filtering
    d3.select("body").append("input")
        .attr("type", "range")
        .attr("min", d3.min(data, d => d.temp_max))
        .attr("max", d3.max(data, d => d.temp_max))
        .attr("value", d3.min(data, d => d.temp_max))
        .on("input", function() {
            const threshold = +this.value;
    
            svg.selectAll("circle")
                .style("opacity", d => d.temp_max >= threshold ? 1 : 0.1);
        });
    
    // label for the slider
    d3.select("body").append("label")
        .text("Filter by Max Temperature")
        .style("margin-left", "10px");

    
    // title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0) 
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Max Temperature vs Total Customers with D3");

    // set up scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.temp_max), d3.max(data, d => d.temp_max)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_cust)])
        .range([height, 0]);

    // add scales to plot
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // add x-axis and y-axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Max Temperature");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - height / 2)
        .style("text-anchor", "middle")
        .text("Total Customers");

    // add circles for each data point
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.temp_max))
        .attr("cy", d => yScale(d.total_cust))
        .attr("r", 5)
        .style("fill", "steelblue");
});