/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-unresolved */
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import '../style/scatter.css';

// set svg parameters
const w = 1000;
const h = 500;
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
  const r = 7;

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

  const tip = d3Tip().html((d) => d)
    .attr('id', 'tooltip')
    .style('opacity', 0)
    .offset([-10, 100]);

  let tipTimer;

  graph.call(tip);
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
    .attr('class', 'dot')
    .on('mouseover', function showTip(e, d) {
      // debugger;
      if (tipTimer) { clearTimeout(tipTimer); }
      const tipstr = `<h4>${d.Name}</h4><h4>Time:${d.Time}</h4><h4>Year:${d.Year}</h4><h4>Place: ${d.Place}</h4><h4>Nationality: ${d.Nationality}</h4><a href=${d.URL}> <h4>${d.Doping}</h4></a>`;
      tip.attr('data-year', d.Year)
        .style('left', `${e.clientX + 5}px`).style('top', `${e.clientY}px`);
      tip.show(tipstr, this);
    })
    .on('mouseout', function tipHide(event) {
      const { target } = event;
      tipTimer = setTimeout(() => tip.hide(target), 2000);
    });

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
