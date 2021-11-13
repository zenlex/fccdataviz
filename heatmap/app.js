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
  const section = d3.select('body').append('section');

  //  / GRAPH HEADER /  //
  const heading = section.append('heading');

  heading.append('h1')
    .attr('id', 'title')
    .text('Monthly Global Land-Surface Temperature');

  heading.append('h3')
    .attr('id', 'description')
    .text(`${data.monthlyVariance[0].year} - ${data.monthlyVariance[data.monthlyVariance.length - 1].year} Base temperature = ${data.baseTemperature}\u00B0 C`);
} // end render function
