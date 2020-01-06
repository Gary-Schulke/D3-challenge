// D3-challenge 
// Gary Schulke
// January 8, 2020

var margin = null, width = null, height = null;
var svg = null, chartView = null;
var data = null;

// set the dimensions and margins of the graph

// Initialize everything that doesn't require the data
function initialize() {
    margin = { top: 10, right: 30, bottom: 40, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    chartView =
        svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
};

function readCSVData() {
    d3.csv("./assets/data/data.csv").then(function (fileData) {
        data = fileData;
        console.log(data);      // Print the data
        buildGraphics();
        buildLabeling();
    }).catch(err => { console.log(err + 'Exception reading file') });
};

function buildGraphics() {
    let maxx = 1 + Math.ceil(d3.max(data, function (d) { return +d.poverty }));
    let minx = -1 + Math.floor(d3.min(data, function (d) { return +d.poverty }));
    let maxy = 1 + Math.ceil(d3.max(data, function (d) { return +d.healthcare }));
    let miny = -1 + Math.floor(d3.min(data, function (d) { return +d.healthcare }));

    // Add X axis
    let x = d3.scaleLinear()
        .domain([minx, maxx])
        .range([0, width])

    chartView.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "15px")
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([miny, maxy])
        .range([height, 0]);

    chartView.append("g")
        .style("font-size", "15px")
        .call(d3.axisLeft(y));

    // Add dots
    chartView.append('g')
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.poverty); })
        .attr("cy", function (d) { return y(d.healthcare); })
        .attr("r", 10.0)
        .attr("text", function (d) { return d.abbr })
        .attr("opacity", "0.5")
        .style("stroke", "#69b3a2")
        .style("fill", "69b3a2");

    chartView.append('g')
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(d => { return d.abbr })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("x", (d) => x(d.poverty))
        .attr("y", (d) => y(d.healthcare - .2));
};

function buildLabeling(){
    // Create axes labels
    chartView.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", 700)
        .text("Mean Healthcare (%)");

    chartView.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
        .attr("class", "axisText")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", 700)
        .text("Poverty (%)");



};

initialize();
readCSVData();
