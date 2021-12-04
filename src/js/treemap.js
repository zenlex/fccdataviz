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
const width = 500 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// add svg to page
const svg = d3.select('#treemap')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// get the data
d3.json(url, (data) => {

  // pass data to cluster
  // ~~~~~~~~~~~~~~~~~PICK UP HERE BY LEARNING WHAT THE HELL d3.hierarchy does
});
