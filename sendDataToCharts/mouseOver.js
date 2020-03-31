function createTooltipData(tooltip, tooltipDims, linesData) {
  const heightOffset = 20;
  const rectSize = 20;
  const ySpacing = rectSize + 5;

  let yPos;
  for (let i = 0; i < linesData.length; i++) {
    yPos = tooltipDims.y + heightOffset + ySpacing * i;
    // Legend
    tooltip
      .append("rect")
      .attr("width", rectSize)
      .attr("height", rectSize)
      .attr("fill", linesData[i].idColour)
      .attr("x", tooltipDims.x + 5)
      .attr("y", yPos - 12);

    // Label
    tooltip
      .append("text")
      .attr("x", tooltipDims.x + 10 + rectSize)
      .attr("y", yPos + 4)
      .text(`${linesData[i].label}:`);

    // Value
    tooltip
      .append("text")
      .attr("data-yVal", linesData[i].yVal)
      .attr("x", tooltipDims.x + tooltipDims.width - 50)
      .attr("y", yPos + 4)
      .attr("style", "font-weight:bold;");
  }
}

export default function mouseOver({ linesData, svg, width, height, yAxis }) {
  const mouseG = svg.append("g").attr("class", "mouse-over-effects");

  // The black vertical line to follow mouse
  const mouseLine = mouseG
    .append("path")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  const lines = document.getElementsByClassName("result-line");

  const mousePerLine = mouseG
    .selectAll(".mouse-per-line")
    .data(linesData)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line")
    .style("opacity", "0")
    .attr("data-yVal", function (d) {
      return d.yVal;
    });

  mousePerLine
    .append("circle")
    .data(linesData)
    .attr("r", 5)
    .style("fill", d => d.idColour)
    .style("stroke-width", "1px");

  mousePerLine.append("text").attr("transform", "translate(10,3)");

  const tooltip = svg
    .append("g")
    .attr("class", "tooltip")
    .style("opacity", "1");

  const tooltipDims = (() => {
    const tooltipDimsWidth = 250;
    const tooltipDimsHeight = 140;
    return {
      width: tooltipDimsWidth,
      height: tooltipDimsHeight,
      x: (width - tooltipDimsWidth) / 2,
      y: (height - tooltipDimsHeight) / 2
    };
  })();
  tooltip
    .append("rect")
    .attr("width", tooltipDims.width)
    .attr("height", tooltipDims.height)
    .attr("x", tooltipDims.x)
    .attr("y", tooltipDims.y)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", "white")
    .attr("stroke", "black");

  createTooltipData(tooltip, tooltipDims, linesData);

  mouseG
    .append("svg:rect") // append a rect to catch mouse movements on canvas
    .attr("width", width) // can't catch mouse events on a g element
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseout", function () {
      // on mouse out hide line, circles and text
      mouseLine.style("opacity", "0");
      d3.selectAll(".mouse-per-line").style("opacity", "0");
      // tooltip.style("opacity", "0");
    })
    .on("mouseover", function () {
      // on mouse in show line, circles and text
      mouseLine.style("opacity", "1");
      d3.selectAll(".mouse-per-line").style("opacity", "1");
      tooltip.style("opacity", "1");
    })
    .on("mousemove", function () {
      // mouse moving over canvas
      const mouse = d3.mouse(this);
      mouseLine.attr("d", function () {
        return `M${mouse[0]},${height} ${mouse[0]},0`;
      });

      d3.selectAll(".mouse-per-line").attr("transform", function (d, i) {
        if (!lines[i]) {
          return;
        }

        let beginning = 0;
        let end = lines[i].getTotalLength();
        let target = null;

        let pos;
        let counter = 0;
        const counterMax = 100;
        while (counter < counterMax) {
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
            break;
          }
          if (pos.x > mouse[0]) {
            end = target;
          } else if (pos.x < mouse[0]) {
            beginning = target;
          } else {
            break; //position found
          }
          counter++;
        }

        const val = Math.round(yAxis.invert(pos.y));
        // Insert the val into the mouse per line text
        const self = d3.select(this);
        self.select("text").text(val);
        const yVal = self.attr("data-yVal");
        // Insert the val into the tooltip
        tooltip.select(`[data-yVal="${yVal}"]`).text(val);

        return `translate(${mouse[0]},${pos.y})`;
      });
    });
}
