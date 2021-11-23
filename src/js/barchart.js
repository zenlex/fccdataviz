/* eslint-disable import/no-unresolved */
import * as d3 from 'd3';
import '../style/barchart.css';

const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

// create svg

const width = 1000; // change this width/height to be responsive
const height = 600;
const padding = 60;

const svg = d3
  .select('.barchart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('align', 'center')
  .attr('class', 'chart-svg');

const updateChart = (data) => {
  // scaling
  const barWidth = (width - 2 * padding) / data.length;
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - padding, padding]);

  const parseTime = d3.timeParse('%Y-%m-%d');
  const dates = [];
  for (const arr of data) {
    dates.push(parseTime(arr[0]));
  }

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dates))
    .range([padding, width - padding]);

  // create tooltip div
  const tip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  // render data
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', barWidth)
    .attr('height', (d) => height - yScale(d[1]) - padding)
    .attr('x', (d, i) => padding + i * barWidth)
    .attr('y', (d) => yScale(d[1]))
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('class', 'bar')
    .on('mouseover', (e, d) => {
      tip.transition().duration(100).style('opacity', 0.9);
      tip
        .html(`<h1>${d[0]}</h1><br><h2>$${d[1]} Billion</h2>`)
        .style('left', `${e.pageX + 30}px`)
        .style('top', `${height - padding - 120}px`)
        .attr('data-date', e.target.dataset.date);
    })
    .on('mouseout', () => {
      tip.transition().duration(200).style('opacity', 0);
    });

  // create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis.ticks(d3.timeYear.every(5)));

  svg
    .append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  // label axes
  svg
    .append('g')
    .attr('class', 'axis-label')
    .attr('transform', `translate(${padding + 20}, ${height / 2})`)
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Gross Domestic Product (Billions)');
};

const fetchData = (url) => fetch(url)
  .then((response) => response.json())
  .then((json) => updateChart(json.data));

fetchData(dataUrl);
