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
  const barWidth = (width - 2 * padding) / (data.length + 2);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - padding, padding]);

  const parseTime = d3.timeParse("%Y-%m-%d");
  const dates = [];
  for (let arr of data) {
    dates.push(parseTime(arr[0]));
  }

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dates))
    .range([padding, width - padding]);

  //render data
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d[1]) - padding)
    .attr("x", (d, i) => padding + (i * barWidth + 2))
    .attr("y", (d) => yScale(d[1]))
    .attr("class", "bar");

  //create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .attr("id", "x-axis")
    .call(xAxis.ticks(d3.timeYear.every(10)));

  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  //TODO: correct alignment of axes/svg rectangles (tests fail)
};

//TODO: add dataset attributes to svg rect data points per user stories
//TODO: create hover state with tooltip
//TODO: clean up overall page styling
//TODO[optional/TBD]: make responsive - could just tag this as an issue for later....? May not work well with the scale of the dataset below certain display sizes
