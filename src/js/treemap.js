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

    const numCats = root.data.children.length;
    const cats = [];
    for (let i = 0; i < numCats; i += 1) {
      cats.push(root.data.children[i].name);
    }
    console.log(cats);

    // const random color array
    const colors = [];
    for (let i = 0; i < numCats; i += 1) {
      const newColor = `rgba(${Math.round(Math.random() * 255)},
       ${Math.round(Math.random() * 122)}, ${Math.round(Math.random() * 125 + 125)}, 0.6)`;

      colors.push(newColor);
    }
    console.log('colors', colors);
    const colorScale = d3.scaleOrdinal().range(colors);

    // construct treemap
    d3.treemap()
      .size([width, height])
      .padding(2)(root);

    // add all the rectangles
    const cell = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

    cell.append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('class', 'tile')
      .style('fill', (d) => colors[cats.indexOf(d.data.category)])
      .attr('data-name', (d) => d.data.name)
      .attr('data-category', (d) => d.data.category)
      .attr('data-value', (d) => d.data.value);

    // add node labels
    cell.append('foreignObject')
      .attr('class', 'foreignObject')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .append('xhtml:div')
      .attr('class', 'label-container')
      .text((d) => d.data.name)
      .attr('text-anchor', 'middle');
  });
