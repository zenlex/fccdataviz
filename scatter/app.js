/* eslint-disable import/no-unresolved */
import * as d3 from 'https://cdn.skypack.dev/d3@7';

// set svg parameters
const w = 800;
const h = 800;
const padding = 60;

const graph = d3.select('.graph-container')
  .append('svg').attr('x', 0).attr('y', 0)
  .attr('width', w)
  .attr('height', h);

// fetch data
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// render graph
function updateGraph(data) {
  // dot radius
  const r = 5;

  // create scales//
  const years = [];
  const seconds = [];
  for (const entry of data) {
    years.push(entry.Year);
    seconds.push(new Date(entry.Seconds * 1000));
  }

  // x-axis scale
  const xScale = d3.scaleLinear([d3.min(years) - 0.5, d3.max(years) + 0.5], [0, w - padding * 2]);
  const xAxis = d3.axisBottom(xScale);
  // y-axis scale
  const yScale = d3.scaleLinear().range([0, h]);
  yScale.domain([d3.min(seconds), d3.max(seconds).setSeconds(d3.max(seconds).getSeconds() + 5)]);
  const yAxis = d3.axisLeft(yScale);

  // render data
  graph.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', r)
    .attr('cx', (d, i) => xScale(years[i]) + padding)
    .attr('cy', (d, i) => yScale(seconds[i]) - padding)
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d, i) => seconds[i])
    .style('fill', (d) => `${d.Doping ? 'red' : 'blue'}`)
    .attr('class', 'dot');

  // append axes
  graph.append('g').attr('id', 'x-axis')
    .attr('transform', `translate(${padding}, ${h - padding})`)
    .call(xAxis.tickFormat(d3.format('d')));
  graph.append('g').attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, ${-padding})`)
    .call(yAxis.tickFormat(d3.timeFormat('%M:%S')));

  // append legend
  const legend = graph.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${w - padding}, ${h / 2 - 20})`);

  legend.append('text')
    .text('No doping allegations')
    .attr('class', 'legend-label')
    .style('fill', 'blue');

  legend.append('text')
    .text('Riders with doping allegations')
    .attr('class', 'legend-label')
    .attr('transform', 'translate(0, 20)')
    .style('fill', 'red');
}

function fetchData(dataUrl, render) {
  fetch(dataUrl)
    .then((response) => response.json())
    .then((data) => {
      render(data);
    });
}

fetchData(url, updateGraph);
