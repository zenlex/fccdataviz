/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
// headings
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import '../style/choropleth.css';

const usURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const usData = d3.json(usURL).catch((err) => console.log(err));
const countyData = d3.json(countyURL).catch((err) => console.log(err));

Promise.all([
  usData,
  countyData,
]).then((values) => render(values[0], values[1]));

const tip = d3Tip();
const svgh = 500;
const svgw = 1000;

console.log(tip, svgh, svgw);

d3.select('#choropleth-container').append('text').text('hello world');

function render(usD, coD) {
  console.log('usData = ', usD);
  console.log('countyData =', coD);
} // end render function
