import mockData from "./mockData.js";
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

function drawLine({ results, svg, xAxis, yAxis }) {
  // Add the line
  svg
    .append("path")
    .datum(results)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return xAxis(d.day);
        })
        .y(function (d) {
          return yAxis(d.susceptible);
        })
    );
}

export default function sendDataToChart(results) {
  if (!results) {
    results = mockData;
  }

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
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
  // Append the axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xAxis));
  svg.append("g").call(d3.axisLeft(yAxis));

  // Draw the succeptible line
  drawLine({ results, svg, xAxis, yAxis });
}
