/* eslint-disable prefer-arrow-callback */
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
d3.json(url)
  .then((data) => {
    // pass data to cluster
    const root = d3.hierarchy(data).sum((d) => d.value);

    const numCats = root.data.children.length;
    const categories = [];
    for (let i = 0; i < numCats; i += 1) {
      categories.push(root.data.children[i].name);
    }

    // const random color array
    const colors = [];
    for (let i = 0; i < numCats; i += 1) {
      const newColor = `rgba(${Math.round(Math.random() * 255)},
       ${Math.round(Math.random() * 255 - 125)}, ${Math.round(Math.random() * 200 + 55)}, 0.6)`;

      colors.push(newColor);
    }
    const colorScale = d3.scaleOrdinal().range(colors);

    // construct treemap
    d3.treemap()
      .size([width, height])
      .padding(2)(root);

    // create tooltips
    const tip = d3Tip()
      .html((d) => d)
      .attr('id', 'tooltip')
      .offset([0, 0]);

    svg.call(tip);

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
      .style('fill', (d) => colors[categories.indexOf(d.data.category)])
      .attr('data-name', (d) => d.data.name)
      .attr('data-category', (d) => d.data.category)
      .attr('data-value', (d) => d.data.value)
      .on('mouseover', function showTip(e) {
        const rectElem = e.currentTarget;
        const tipstr = `${rectElem.dataset.name}<br>
        ${d3.format('$,.0f')(rectElem.dataset.value)}`;
        tip.attr('data-value', rectElem.dataset.value);
        tip.show(tipstr, this);
      })
      .on('mouseout', () => tip.hide(null));

    // add node labels
    cell.append('foreignObject')
      .attr('class', 'foreignObject')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('data-name', (d) => d.data.name)
      .attr('data-category', (d) => d.data.category)
      .attr('data-value', (d) => d.data.value)
      .attr('text-anchor', 'middle')
      .on('mouseover', function showTip(e) {
        const rectElem = e.currentTarget.previousSibling;
        const tipstr = `${rectElem.dataset.name}<br>
        ${d3.format('$,.0f')(rectElem.dataset.value)}`;
        tip.attr('data-value', rectElem.dataset.value);
        tip.show(tipstr, this);
      })
      .on('mouseout', () => tip.hide(null))
      .append('xhtml:div')
      .attr('class', 'label-container')
      .text((d) => d.data.name);

    const LEGEND_RECT_SIZE = 12;
    const LEGEND_TEXT_OFFSET_X = 5;
    const LEGEND_TEXT_OFFSET_Y = 3;
    const LEGEND_ELEM_SPACING = 120;
    const LEGEND_ROW_SPACING = 30;

    const legend = d3.select('#legend');

    const legendElement = legend.selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'legend-element')
      .attr('transform', (d, i) => `translate(${(i % 3) * (LEGEND_RECT_SIZE + LEGEND_ELEM_SPACING)}, ${Math.floor(i / 3) * LEGEND_ROW_SPACING})`);

    legendElement.append('rect')
      .attr('width', LEGEND_RECT_SIZE)
      .attr('height', LEGEND_RECT_SIZE)
      .attr('class', 'legend-item')
      .style('fill', (d) => colors[categories.indexOf(d)]);

    legendElement.append('text')
      .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_OFFSET_X)
      .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_OFFSET_Y)
      .attr('fill', 'white')
      .text((d) => d);
  });
