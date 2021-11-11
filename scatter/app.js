import * as d3 from "https://cdn.skypack.dev/d3@7";

//set svg parameters
const w = 800;
const h = 800;
const padding = 60;

const graph = d3.select('.graph-container')
  .append("svg").attr("x", 0).attr("y", 0).attr("width", w).attr("height", h);

//fetch data
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

function fetchData(url, render) {
  const dataset = fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      render(data)
    })
}

fetchData(url, updateGraph);

//render graph
function updateGraph(data) {

  //create scales//
  let years = [];
  let seconds = [];
  for (let entry of data) {
    years.push(entry.Year);
    seconds.push(new Date(entry.Seconds * 1000));
  }

  //x-axis scale
  const xScale = d3.scaleLinear(d3.extent(years), [0, w]);
  const xAxis = d3.axisBottom(xScale);
  //y-axis scale
  const yScale = d3.scaleLinear(d3.extent(seconds), [0, h])
  const yAxis = d3.axisLeft(yScale);

  //dot radius
  const r = 5



  graph.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d, i) => xScale(years[i]) + padding)
    .attr("cy", (d, i) => yScale(seconds[i]) - padding)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d, i) => seconds[i])
    .style("fill", "red")
    .attr("class", "dot");

  //append axes
  graph.append("g").attr("id", "x-axis").attr("transform", `translate(${padding}, ${h - padding})`).call(xAxis.tickFormat(d3.format("d")))
  graph.append("g").attr("id", "y-axis").attr("transform", `translate(${padding}, ${-padding})`).call(yAxis.tickFormat(d3.timeFormat("%M:%S")))

  //append legend

  const legend = graph.append("g");
  legend.append("rect").attr("x", w-120).attr("y", h / 2).attr("width", 100).attr("height", 100).attr("id", "legend")

}