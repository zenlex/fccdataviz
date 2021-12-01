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

const colors = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];

Promise.all([
  edData,
  geoData,
]).then((values) => render(values[0], values[1]));

const svgh = 600;
const svgw = 1000;

function render(edD, geoD) {
  const path = d3.geoPath();
  const container = d3.select('#choropleth-container');
  container.append('svg');

  const svg = d3.select('svg');
  svg.attr('height', svgh)
    .attr('width', svgw);

  const tip = d3Tip()
    .html((d) => d)
    .attr('id', 'tooltip')
    .offset([0, 0]);

  svg.call(tip);

  svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(geoD, geoD.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .style('fill', (d) => {
      const res = edD.filter((obj) => obj.fips === d.id);
      const colorIndex = Math.round(res[0].bachelorsOrHigher / (100 / colors.length));
      return colors[colorIndex];
    })
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
    .style('stroke', '#fff')
    .on('mouseover', function showTip(e, d) {
      let tipStr;
      const res = edD.filter((obj) => obj.fips === d.id);
      if (res[0]) {
        tipStr = `<h4>${res[0].area_name}, ${res[0].state}:</h4>
          <br><strong>${res[0].bachelorsOrHigher} %</strong>`;
      } else tipStr = '<h4>No Data Found</h4>';
      tip.attr('data-education', e.target.dataset.education);
      tip.show(tipStr, this);
    })
    .on('mouseout', function hideTip() {
      tip.hide(null, this);
    });

  svg.append('path')
    .datum(
      topojson.mesh(geoD, geoD.objects.states, (a, b) => a !== b),
    )
    .attr('class', 'states')
    .attr('d', path);

  /*----------------------------------
        LEGEND
  ----------------------------------*/
  const lcWidth = 30;

  svg.append('g').attr('id', 'legend').attr('transform', `translate(${((svgw / 2) + lcWidth * colors.length)}, ${lcWidth / 2})`);
  const legend = d3.select('#legend');
  legend.selectAll('rect')
    .data(colors.reverse())
    .enter()
    .append('rect')
    .attr('class', 'lc')
    .attr('x', (d, i) => i * lcWidth)
    .attr('width', lcWidth)
    .attr('height', lcWidth)
    .style('fill', (d) => d);

  const legendThreshold = d3.scaleThreshold()
    .domain(
      d3.range(2.6, 75.1, (75.1 - 2.6) / colors.length),
    ).range([colors]);

  const legXscale = d3.scaleLinear().domain([2.6, 75.1]).range([0, colors.length * lcWidth]);

  const legXaxis = d3.axisBottom(legXscale).tickSize(10, 0).tickValues(legendThreshold.domain()).tickFormat(d3.format('.1f'));

  legend.append('g').attr('id', 'legend-axis').attr('transform', `translate(0, ${lcWidth})`).call(legXaxis);

  legend.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (lcWidth * colors.length) / 2)
    .attr('y', lcWidth * 2.5)
    .text('% with Bachelors or higher');
} // end render function
