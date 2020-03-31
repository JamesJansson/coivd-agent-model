export default function mouseOver({ results, svg, width, height, yAxis }) {
  const mouseG = svg.append("g").attr("class", "mouse-over-effects");

  mouseG
    .append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  const lines = document.getElementsByClassName("result-line");

  const mousePerLine = mouseG
    .selectAll(".mouse-per-line")
    .data(results)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("text").attr("transform", "translate(10,3)");

  mouseG
    .append("svg:rect") // append a rect to catch mouse movements on canvas
    .attr("width", width) // can't catch mouse events on a g element
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseout", function () {
      // on mouse out hide line and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line text").style("opacity", "0");
    })
    .on("mouseover", function () {
      // on mouse in show line and text
      d3.select(".mouse-line").style("opacity", "1");
      d3.selectAll(".mouse-per-line text").style("opacity", "1");
    })
    .on("mousemove", function () {
      // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line").attr("d", function () {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
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

        d3.select(this)
          .select("text")
          .text(Math.round(yAxis.invert(pos.y)));

        return "translate(" + mouse[0] + "," + pos.y + ")";
      });
    });
}
