import mockData from "./mockData.js";
import mouseOver from "./mouseOver.js";
// TODO: comment out the import and the use in the below function

function createAxes({ results, width, height, margin }) {
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

function drawLine({
  results,
  svg,
  xAxis,
  yAxis,
  idColour,
  yVal,
  createPolygon,
  fill = "none"
}) {
  results = JSON.parse(JSON.stringify(results));

  if (createPolygon) {
    const firstPoint = results[0];
    results.push(firstPoint);
  }

  // Add the line
  svg
    .append("path")
    .datum(results)
    .attr("data-yVal", yVal)
    .attr("class", "result-line")
    .attr("fill", fill)
    .attr("stroke", idColour)
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
  const margin = { top: 10, right: 30, bottom: 200, left: 70 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top;

  // append the svg object to the body of the page
  var svg = d3
    .select("#data-chart")
    .html("")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create Axes
  const { xAxis, yAxis } = createAxes({ results, width, height, margin });
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

  const linesData = [
    {
      label: "Susceptible",
      yVal: "susceptible",
      idColour: "#0001FE"
    },
    {
      label: "Infected",
      yVal: "infected",
      idColour: "#F90504",
      fill: "#F90504",
      createPolygon: true
    },
    { label: "Recovered", yVal: "recovered", idColour: "#008700" },
    { label: "Newly Infected", yVal: "newlyInfected", idColour: "#880303" },
    { label: "Newly Recovered", yVal: "newlyRecovered", idColour: "#005600" }
  ];

  for (let i = 0; i < linesData.length; i++) {
    drawLine({ results, svg, xAxis, yAxis, ...linesData[i] });
  }

  mouseOver({ linesData, svg, width, height, margin, xAxis, yAxis });
}
