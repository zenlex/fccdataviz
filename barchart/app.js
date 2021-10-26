import * as d3 from "https://cdn.skypack.dev/d3@7";
const chart = document.querySelector(".container.barchart");
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

//create svg

const width = 600; //change this width/height to be responsive
const height = 400;

const svg = d3
  .select(".barchart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("align", "center")
  .attr("class", "chart-svg");

//get data
const fetchData = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      updateChart(svg, json.data);
    });
};

fetchData(url);

const updateChart = (svg, data) => {
  const barWidth = Math.floor(width / data.length);
  console.log(`barWidth: ${barWidth}`);
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", (d) => d[1] / 10)
    .attr("x", (d, i) => i * (barWidth + 1))
    .attr("y", (d) => height - d[1] / 50);
};
//map data to d3

//map data to rectangles

//style

//label
