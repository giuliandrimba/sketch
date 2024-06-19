import { Context, Element } from 'svgcanvas';
import download from './util/download';

let svgcanvas;

let sidebar = document.querySelector('.root > div [style|="grid"]')
sidebar.children[0].style.display = 'none'
sidebar.children[1].style.display = 'none'
sidebar.children[2].style.borderBottom = 'none'

let saveInstructions = document.createElement('div')
saveInstructions.classList.add('svg-export-info')
saveInstructions.innerHTML = '<p>Download: <span>Cmd + E</span></p>'

sidebar.appendChild(saveInstructions)

export let onResizePreview = ({ index, canvas, container, width, height }) => {
  let svg = svgcanvas.svg;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
}

export let onMountPreview = ({ canvas }) => {
  svgcanvas = new Element();
  let svg = svgcanvas.svg;
  svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`)
  canvas.parentNode.appendChild(svgcanvas.getElement())
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
      download(svgcanvas.svg, canvas.width, canvas.height)
    }
  })
  let svgContext =  svgcanvas.getContext('2d');

	return {
		context: svgContext,
    clear: () => {
      svgContext.__clearCanvas()
    }
	};
};
