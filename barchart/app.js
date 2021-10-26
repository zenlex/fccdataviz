import * as d3 from "https://cdn.skypack.dev/d3@7";
const chart = document.querySelector(".container.barchart");
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

//create svg

const width = 600; //change this width/height to be responsive
const height = 400;
const padding = 60;

const svg = d3
  .select(".barchart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("align", "center")
  .attr("class", "chart-svg");

const fetchData = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      updateChart(json.data);
    });
};

fetchData(url);

const updateChart = (data) => {
  //scaling
  const barWidth = (width - padding) / (data.length + 2);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([0, height - padding]);

  const xScale = d3 //TODO: convert the labeling/ticks to dates and replace temp values
    .scaleLinear()
    .domain([1, 100])
    .range([padding, width - padding]);

  //render data
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", (d) => yScale(d[1]))
    .attr("x", (d, i) => i * barWidth + 2)
    .attr("y", (d) => height - padding - yScale(d[1]))
    .attr("class", "bar");

  //create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append("g").attr("transform", `translate(${padding}, 0)`).call(yAxis);

  //TODO: correct axes labels/ticks to be the correct range/units/intervals
};

//style
//TODO: create hover state with tooltip
//TODO: clean up overall page styling
//TODO[optional/TBD]: make responsive - could just tag this as an issue for later....? May not work well with the scale of the dataset below certain display sizes
