import { Context, Element } from 'svgcanvas';

function downloadSVG(svg, width, height) {
  let exported = svg.cloneNode(true);
  exported.setAttribute('width', width)
  exported.setAttribute('height', height)
  var data = new XMLSerializer().serializeToString(exported);
  var blob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a');
  a.href = url;
  a.download = 'image.svg'; // Desired file name
  document.body.appendChild(a); // Append the anchor to the body
  a.click(); // Click the anchor
  document.body.removeChild(a); // Remove the anchor from the body
  URL.revokeObjectURL(url);
}

export let onMountPreview = ({ canvas }) => {
	const options = {
		enableMirroring: false, // whether canvas mirroring (get image data) is enabled (defaults to false)
	};
  const svgcanvas = new Element(options);
  let svg = svgcanvas.svg;
  svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`)
  canvas.parentNode.appendChild(svgcanvas.getElement())

  window.addEventListener('keyup', (event) => {
    if (event.key === 'E' || event.key === 'e') {
      downloadSVG(svgcanvas.svg, canvas.width, canvas.height)
    }
  })

	return {
		context: svgcanvas.getContext('2d')
	};
};
