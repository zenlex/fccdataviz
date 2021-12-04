/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import '../style/treemap.css';

const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

// treemap sizing
const margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};
const width = 1000 - margin.left - margin.right;
const height = 1000 - margin.top - margin.bottom;

// add svg to page
const svg = d3.select('#treemap')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// get the data
console.log('calling d3.json with url = ', url);
d3.json(url)
  .then((data) => {
    console.log('data = ', data);

    // pass data to cluster
    const root = d3.hierarchy(data).sum((d) => d.value);

    // construct treemap
    d3.treemap()
      .size([width, height])
      .padding(2)(root);

    // add all the rectangles
    svg.selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('class', 'tile')
      .attr('data-name', (d) => d.data.name)
      .attr('data-category', (d) => d.data.category)
      .attr('data-value', (d) => d.data.value);

    // add node labels
    svg.selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .attr('x', (d) => d.x0 + 5)
      .attr('y', (d) => d.y0 + 10)
      .attr('class', 'cell-label')
      .text((d) => d.data.name);
  });
