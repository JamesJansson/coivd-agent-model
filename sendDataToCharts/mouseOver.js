export default function mouseOver({ linesData, svg, width, height, yAxis }) {
  const mouseG = svg.append("g").attr("class", "mouse-over-effects");

  const mouseLine = mouseG
    .append("path") // this is the black vertical line to follow mouse
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
    .attr("data-line", function (d) {
      return d.yVal;
    });

  mousePerLine
    .append("circle")
    .attr("r", 5)
    .style("stroke", "black")
    .style("fill", "black")
    .style("stroke-width", "1px");

  mousePerLine.append("text").attr("transform", "translate(10,3)");

  const focus = svg.append("g").attr("class", "focus").style("opacity", "1");
  const focusDims = (() => {
    const focusDimsWidth = 150;
    const focusDimsHeight = 100;
    return {
      width: focusDimsWidth,
      height: focusDimsHeight,
      x: (width - focusDimsWidth) / 2,
      y: (height - focusDimsHeight) / 2
    };
  })();
  focus
    .append("rect")
    .attr("class", "tooltip")
    .attr("width", focusDims.width)
    .attr("height", focusDims.height)
    .attr("x", focusDims.x)
    .attr("y", focusDims.y)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", "white")
    .attr("stroke", "black");

  // Label
  focus
    .append("text")
    .attr("x", focusDims.x)
    .attr("y", focusDims.y + 12)
    .text("Data:");

  // Value
  focus
    .append("text")
    .attr("class", "tooltip-data")
    .attr("x", focusDims.x + focusDims.width - 40)
    .attr("y", focusDims.y + 12);

  focus
    .append("text")
    .attr("class", "tooltip-likes")
    .attr("x", 60)
    .attr("y", 18);

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
      // focus.style("opacity", "0");
    })
    .on("mouseover", function () {
      // on mouse in show line, circles and text
      mouseLine.style("opacity", "1");
      d3.selectAll(".mouse-per-line").style("opacity", "1");
      focus.style("opacity", "1");
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
        d3.select(this).select("text").text(val);

        focus.select(".tooltip-data").text(val);

        return `translate(${mouse[0]},${pos.y})`;
      });
    });
}
