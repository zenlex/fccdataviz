/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
// headings
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as topojson from 'topojson';
import '../style/choropleth.css';

const edDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const countiesGeoURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const edData = d3.json(edDataURL).catch((err) => console.log(err));
const geoData = d3.json(countiesGeoURL).catch((err) => console.log(err));

Promise.all([
  edData,
  geoData,
]).then((values) => render(values[0], values[1]));

const tip = d3Tip();
const svgh = 500;
const svgw = 1000;

function render(edD, geoD) {
  const path = d3.geoPath();
  const container = d3.select('#choropleth-container');
  container.append('svg');

  const svg = d3.select('svg');
  svg.attr('height', svgh)
    .attr('width', svgw);

  svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(geoD, geoD.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => {
      const res = edD.filter((obj) => obj.fips === d.id);
      if (res[0]) {
        return res[0].bachelorsOrHigher;
      }
      console.log(`no data found for id ${d.id}`);
      return null;
    })
    .attr('d', path)
    .style('stroke', '#fff');

  svg.append('path')
    .datum(
      topojson.mesh(geoD, geoD.objects.states, (a, b) => a !== b),
    )
    .attr('class', 'states')
    .attr('d', path);

  console.log('usData = ', edD);
  console.log('countyData =', geoD.objects.counties);
} // end render function
