import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import '../style/treemap.css';

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
