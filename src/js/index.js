// this serves no purpose at the moment
const linksContainer = document.querySelector('#links');

const links = [
  {text:'Stacks on Stacks on Stacks - A Barchart', url: '/barchart.html' },
  {text:'Dope Scatterplot', url: '/scatter.html' },
  {text:'A Literal Heatmap', url: '/heatmap.html' },
  {text:'Higher Ed in Color - a Choropleth Map', url: '/choropleth.html' }
]


const list = linksContainer.appendChild('ul');
for (const link of links){
  newItem = linksContainer.appendChild('li');
  newLink = newItem.appendChild('a')
  newLink.href = link.url
  newLink.textContent = link.text
}
