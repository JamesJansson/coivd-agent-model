import mockData from "./mockData.js";
import mouseOver from "./mouseOver.js";
// TODO: comment out the import and the use in the below function

function createAxes({ results, width, height }) {
  // Create X axis
  const xAxis = d3
    .scaleLinear()
    .domain(
      d3.extent(results, function (result) {
        return result.day;
      })
    )
    .range([0, width]);

  // Create Y axis
  const yAxis = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(results, function (result) {
        return result.susceptible;
      })
    ])
    .range([height, 0]);

  return { xAxis, yAxis };
}

function drawLine({ results, svg, xAxis, yAxis, stroke, yVal }) {
  // Add the line
  svg
    .append("path")
    .datum(results)
    .attr("class", "result-line")
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(result => xAxis(result.day))
        .y(result => yAxis(result[yVal]))
    );
}

export default function sendDataToChart(results) {
  if (!results) {
    results = mockData;
  }

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 40, left: 70 };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#data-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create Axes
  const { xAxis, yAxis } = createAxes({ results, width, height });
  // Append the axes and create some axis titles
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xAxis));
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 25)
    .text("Day");

  svg.append("g").call(d3.axisLeft(yAxis));
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .text("Individuals");

  // Succeptible line
  drawLine({
    results,
    svg,
    xAxis,
    yAxis,
    stroke: "#0001FE",
    yVal: "susceptible"
  });

  // Infected line
  drawLine({
    results,
    svg,
    xAxis,
    yAxis,
    stroke: "#F90504",
    yVal: "infected"
  });

  // Recovered line
  drawLine({
    results,
    svg,
    xAxis,
    yAxis,
    stroke: "#008700",
    yVal: "recovered"
  });

  // Newly Infected line
  drawLine({
    results,
    svg,
    xAxis,
    yAxis,
    stroke: "#880303",
    yVal: "newlyInfected"
  });

  // Newly Recovered line
  drawLine({
    results,
    svg,
    xAxis,
    yAxis,
    stroke: "#005600",
    yVal: "newlyRecovered"
  });

  mouseOver({ results, svg, width, height, xAxis, yAxis });
}
