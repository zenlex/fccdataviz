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

  const colors = ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'];

  function mapColor(v) {
    const shades = colors.length;

    const colorScale = d3.scaleLinear()
      .domain(d3.extent(data.monthlyVariance.map(({ variance }) => variance))).range([shades, 0]);

    const index = Math.round(colorScale(v));
    return colors[index];
  }

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
  const mapHeight = 400;
  const svgHeight = 540;
  const width = 1200;
  const padding = 60;

  const years = data.monthlyVariance.map(({ year, month }) => new Date(year, month - 1));

  const temps = data.monthlyVariance.map(({ variance }) => data.baseTemperature + variance);
  console.log(temps);

  const xScale = d3.scaleTime()
    .domain(d3.extent(years))
    .range([0, width]);

  const yScale = d3.scaleTime()
    .domain([new Date(2021, -1, 15), new Date(2021, 11, 15)])
    .range([mapHeight - 2 * padding, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

  const svg = section.append('svg').attr('x', 0).attr('y', 0).attr('width', width)
    .attr('height', svgHeight);

  svg.append('g').attr('transform', `translate(${padding},${mapHeight - padding})`).attr('id', 'x-axis').call(xAxis);

  svg.append('g').attr('transform', `translate(${padding}, ${padding})`).attr('id', 'y-axis').call(yAxis);

  /* ------------------------
    RENDER DATA CELLS
  -------------------------*/
  const cellHeight = (mapHeight - 2 * padding) / 12;
  const cellWidth = (width / data.monthlyVariance.length) * 12;

  svg.append('g').selectAll('rect')
    .data(data.monthlyVariance)
    .enter()
    .append('rect')
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .attr('x', (d) => xScale(new Date(d.year, 0)) + padding)
    .attr('y', (d) => yScale(new Date(2021, d.month - 1)) + padding - (cellHeight / 2))
    .attr('class', 'cell')
    .style('fill', (d) => mapColor(d.variance))
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => data.baseTemperature + d.variance);

  /* ---------------------------------
    LEGEND
  --------------------------------*/
  const legend = svg.append('g');

  legend.attr('id', 'legend')
    .attr('transform', `translate(${padding}, ${mapHeight})`);

  const lcWidth = 30;

  legend.append('g')
    .selectAll('rect')
    .data(colors.reverse())
    .enter()
    .append('rect')
    .attr('class', 'lc')
    .attr('x', (d, i) => i * lcWidth)
    .attr('y', 0)
    .attr('width', lcWidth)
    .attr('height', lcWidth)
    .style('fill', (d) => d);

  const legendThreshold = d3.scaleThreshold()
    .domain(((min, max, count) => {
      const arr = [];
      const step = (max - min) / count;
      const base = min;
      for (let i = 1; i < count; i += 1) {
        arr.push(base + step * i);
      }
      return arr;
    })(d3.min(temps), d3.max(temps), colors.length))
    .range([colors]);

  const legXscale = d3.scaleLinear()
    .domain(d3.extent(temps))
    .range([0, colors.length * lcWidth]);

  const legXaxis = d3.axisBottom(legXscale).tickSize(10, 0).tickValues(legendThreshold.domain()).tickFormat(d3.format('.1f'));

  legend.append('g').attr('id', 'legend-axis').attr('transform', `translate(0, ${lcWidth})`)
    .call(legXaxis);

  // TODO: add labels for all axes and try .nice() on domains
} // end render function
