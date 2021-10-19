import * as d3 from "https://cdn.skypack.dev/d3@7";
const chart = document.querySelector(".container.barchart");
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
//get data
const fetchData = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      updateChart(json.data);
    });
};

fetchData(url);

//create svg

// const width = 600; //change this width/height to be responsive
// const height = 400;
// const svg = d3.create("svg").attr([0, 0, width, height]);

const updateChart = (data) => {
  d3.select(".barchart")
    .selectAll("h4")
    .data(data)
    .enter()
    .append("h4")
    .text((d) => `${d[0]}, ${d[1]}`);
};
//map data to d3

//map data to rectangles

//style

//label
