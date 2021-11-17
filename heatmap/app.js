/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
// headings
// eslint-disable-next-line import/no-unresolved
import * as d3 from 'https://cdn.skypack.dev/d3@7';

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url)
  .then((data) => render(data))
  .catch((err) => console.log(err));

function render(data) {
  console.log('Data:', data);
  const section = d3.select('body').append('section');

  //  / GRAPH HEADER /  //
  const heading = section.append('heading');

  heading.append('h1')
    .attr('id', 'title')
    .text('Monthly Global Land-Surface Temperature');

  heading.append('h3')
    .attr('id', 'description')
    .text(`${data.monthlyVariance[0].year} - ${data.monthlyVariance[data.monthlyVariance.length - 1].year} Base temperature = ${data.baseTemperature}\u00B0 C`);

  /*--------------------------------------
  CREATE AXES & SCALES
 ---------------------------------------*/
  const height = 400;
  const width = 1200;
  const padding = 60;

  const years = data.monthlyVariance.map(({ year, month }) => new Date(year, month - 1));

  const xScale = d3.scaleTime()
    .domain(d3.extent(years))
    .range([0, width]);

  const yScale = d3.scaleTime()
    .domain([new Date(2021, -1, 15), new Date(2021, 11, 15)])
    .range([height - 2 * padding, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

  const svg = section.append('svg').attr('x', 0).attr('y', 0).attr('width', width)
    .attr('height', height);

  svg.append('g').attr('transform', `translate(${padding},${height - padding})`).attr('id', 'x-axis').call(xAxis);

  svg.append('g').attr('transform', `translate(${padding}, ${padding})`).attr('id', 'y-axis').call(yAxis);

  /* ------------------------
    RENDER DATA CELLS
  -------------------------*/
  const cellHeight = (height - 2 * padding) / 12;
  const cellWidth = (width / data.monthlyVariance.length) * 12;

  svg.selectAll('rect')
    .data(data.monthlyVariance)
    .enter()
    .append('rect')
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .attr('x', (d) => xScale(new Date(d.year, 0)) + padding)
    .attr('y', (d) => yScale(new Date(2021, d.month - 1)) + padding - (cellHeight / 2))
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => data.baseTemperature + d.variance);
} // end render function
