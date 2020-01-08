// D3-challenge 
// Gary Schulke
// January 8, 2020

var margin = null, width = null, height = null;
var svg = null, chartView = null;
var data = null;                    // The data source file.
var horLabels, vertLabels;
var selectedX = "poverty", xAxis, xCircles;
var selectedY = "healthcare", yAxis, yCircles;
var xLabelList = {}, yLabelList = {};

// Create and return the linear X scale
// theData - all source data
// dataHeading - the column key in the data file.
// returns the d3 X linear scale.
function createXDomainAndRange(theData, dataHeading) {
    let maxx = 1 + Math.ceil(d3.max(theData, function (d) { return +d[dataHeading] }));
    let minx = -1 + Math.floor(d3.min(theData, function (d) { return +d[dataHeading] }));
    let xLinearScale = d3.scaleLinear()
        .domain([minx, maxx])
        .range([0, width]);
    return xLinearScale;
};

// Create and return the linear Y scale
// theData - all source data
// dataHeading - the column key in the data file.
// returns the d3 Y linear scale.
function createYDomainAndRange(theData, dataHeading) {
    let maxy = 1 + Math.ceil(d3.max(data, function (d) { return +d[dataHeading] }));
    let miny = -1 + Math.floor(d3.min(data, function (d) { return +d[dataHeading] }));

    let yLinearScale = d3.scaleLinear()
        .domain([miny, maxy])
        .range([height, 0]);
    return yLinearScale;
};

// Initialize everything that doesn't require the data
// Runs first at startup.
function initialize() {                     //80
    margin = { top: 10, right: 30, bottom: 140, left: 100 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    chartView =
        svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


                           
};

// Reads in the CSV file and create the original graph.
// Runs second at startup.
function readCSVData() {
    d3.csv("./assets/data/data.csv").then(function (fileData) {
        data = fileData;
        console.log(data);      // Print the data
        buildGraphics();
        buildLabeling();
    }).catch(err => { console.trace(err + ' Exception reading file') });
};

// Build the graphic (circles) part of the graph.
// Creates the initial default chart.
function buildGraphics() {

    // Add X axis
    xLinearScale = createXDomainAndRange(data, selectedX);
    xAxis = chartView.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "15px")
        .call(d3.axisBottom(xLinearScale));

    // Add Y axis
    yLinearScale = createYDomainAndRange(data, selectedY);
    yAxis = chartView.append("g")
        .style("font-size", "15px")
        .call(d3.axisLeft(yLinearScale));

    // Add dots
    yCircles = chartView.append('g');
    yCircles.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xLinearScale(d[selectedX]); })
        .attr("cy", function (d) { return yLinearScale(d[selectedY]); })
        .attr("r", 10.0)
        .attr("text", function (d) { return d.abbr })
        .attr("opacity", "0.5")
        .style("stroke", "#69b3a2")
        .style("fill", "69b3a2");
};

// Build the axis labeling and text in circle part of the graph.
// Creates the initial default chart.
function buildLabeling() {
    // Create axes labels
    // Inner circle labels (state abbreviation)
    chartView.append('g')
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .classed("stateabbr", true)
        .text(d => { return d.abbr })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("x", (d) => xLinearScale(d[selectedX]))
        .attr("y", (d) => yLinearScale(d[selectedY] - .2));

    // Horizontal (x-axis labels)
    horLabels = chartView.append('g')
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`);
    xLabelList["poverty"] = createXLabels(horLabels, "poverty", "Poverty (%)", false, 150);
    xLabelList["age"] = createXLabels(horLabels, "age", "Age", true, 170);
    xLabelList["income"] = createXLabels(horLabels, "income", "Income", true, 190);
    // Verticle (yaxis labels)

    vertLabels = chartView.append('g')
        .attr("transform", "rotate(-90)");
    yLabelList["healthcare"] = createYLabels(vertLabels, "healthcare", "Healthcare (%)", false, 45);
    yLabelList["obesity"] = createYLabels(vertLabels, "obesity", "Obesity (%)", true, 20);
    yLabelList["smokes"] = createYLabels(vertLabels, "smokes", "Smokes (%)", true, 0);

    // Click handlers for the X and Y axis labels.
    horLabels.selectAll("text").on("click", changeXChart);
    vertLabels.selectAll("text").on("click", changeYChart);
};

// Generalized function to make the X axis labels.
// hLabels - the group for the x labels.
// lblValue - the value assigned to the label.  Used to id the clicked on label.
// lblText - The text string displayed.
// lblActive - Sets the acitve / inactive appearance of the text.
// offset -  the offset down from the x axis.
function createXLabels(hLabels, lblValue, lblText, lblActive, offset) {
    let lbl = hLabels.append("text")
        .attr("y", 0 - margin.bottom + offset)
        .attr("class", "axisText")
        .attr("value", lblValue)
        .classed("inactive", lblActive)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", 700)
        .text(lblText);
    return lbl;
};

// Generalized function to make the Y axis labels.
// vLabels - the group for the y labels.
// lblValue - the value assigned to the label.  Used to id the clicked on label.
// lblText - The text string displayed.
// lblActive - Sets the acitve / inactive appearance of the text.
// offset -  the offset left from the y axis.
function createYLabels(vLabels, lblValue, lblText, lblActive, offset) {
    let lbl = vLabels.append("text")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left + offset)
        .attr("value", lblValue)
        .attr("class", "axisText")
        .classed("inactive", lblActive)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", 700)
        .attr("dy", "1em")
        .text(lblText);
    //       .attr("dy", "1em") 
    return lbl;
};

// Generalized function to change the enable / disable
// appearance of the axis labeling.
// labellist - a dictionary of either the x axis labels or the y axis labels.
// selected - the value of the selected labe.
function changeActiveLabels(labellist, selected) {
    for (var key in labellist) {
        labellist[key].classed("inactive", true);
    };
    labellist[selected].classed("inactive", false);
};

// Updates the x or y position of the dots and labeling.
// allCircles - The group of circles.
function renderCircles(allCircles, linearScale, selected, forAxis) {
    let cir = "cx", txt = "x", offset = 0;
    if (forAxis === "y"){
        cir = "cy"; txt = "y"; offset = 0.2
    };
    allCircles.transition()
        .duration(1000)
        .selectAll("circle")
        .attr(cir, function (d) { return linearScale(d[selected]);});

    chartView.transition()
        .duration(1000)
        .selectAll('text.stateabbr')
        .attr(txt, (d) => { return linearScale(d[selected] - offset)});

    return allCircles;
};

// The event handler for a chance in x axis selection
function changeXChart() {
    let value = d3.select(this).attr('value');
    selectedX = value;
    xLinearScale = createXDomainAndRange(data, selectedX);
    xAxis = renderXAxes(xLinearScale, xAxis);
    xCircles = renderCircles(yCircles, xLinearScale, selectedX, "x");
    changeActiveLabels(xLabelList, selectedX);
};

// Update the x axis scaling.
// xLinearScale - the new scaling.
// xAxis - the x axis group.
function renderXAxes(xLinearScale, xAxis) {
    let bottomAxis = d3.axisBottom(xLinearScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};

// The event handler for a change in the Y axis.
function changeYChart() {
    let value = d3.select(this).attr('value');
    selectedY = value;

    yLinearScale = createYDomainAndRange(data, selectedY);

    yAxis = renderYAxes(yLinearScale, yAxis);
    yCircles = renderCircles(yCircles, yLinearScale, selectedY, "y");
    changeActiveLabels(yLabelList, selectedY);
};

// Update the y axis scaling.
// yLinearScale - the new scaling.
// yAxis - the y axis group.
function renderYAxes(yLinearScale, yAxis) {
    let leftAxis = d3.axisLeft(yLinearScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};

// Start it up.
initialize();
readCSVData();
