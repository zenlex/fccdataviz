import * as d3 from "https://cdn.skypack.dev/d3@7";

//set svg parameters
const w = 800;
const h = 800;

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
  for (let entry of data){
    years.push(entry.Year);
    seconds.push(entry.Seconds);
  }
  
  //x-axis scale
  const xScale = d3.scaleLinear(d3.extent(years), [0,w]);

  //y-axis scale
  const yScale = d3.scaleLinear(d3.extent(seconds), [0, h])
  //dot radius
  const r = 5


 graph.selectAll("circle").data(data).enter().append("circle").attr("r", 5).attr("cx", d=>xScale(d.Year)).attr("cy", d=>yScale(d.Seconds)).style("fill", "red")
}