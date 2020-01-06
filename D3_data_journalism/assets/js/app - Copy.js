// @TODO: YOUR CODE HERE!

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");    


d3.csv("./assets/data/data.csv").then(function(data) {

// Print the forceData
    console.log(data);
    let maxx = 1 + Math.ceil(d3.max(data, function(d) { return  +d.poverty}));
    let minx = -1 + Math.floor(d3.min(data, function(d) { return  +d.poverty}));
    let maxy = 1 + Math.ceil(d3.max(data, function(d) { return  +d.healthcare}));
    let miny = -1 + Math.floor(d3.min(data, function(d) { return  +d.healthcare}));

// Add X axis
  var x = d3.scaleLinear()
    .domain([minx, maxx])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));  

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([miny, maxy])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

      // Add dots
  svg.append('g')
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function (d) { return x(d.poverty); } )
    .attr("cy", function (d) { return y(d.healthcare); } )
    .attr("r", 10.0)
    .attr("text", function(d) {console.log(d.abbr); return d.abbr})
    .attr("opacity", "0.5")
    .style("stroke", "#69b3a2")
    .style("fill", "69b3a2");
    svg.append('g')
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(d => {return d.abbr})
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("x", (d) => x(d.poverty))
        .attr("y", (d) => y(d.healthcare - .2));

  


    // Format the date and cast the force value to a number
/*     forceData.forEach(function(data) {
      data.date = parseTime(data.date);
      data.force = +data.force; */
    });