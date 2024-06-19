export default (svg, width, height) => {
  let exported = svg.cloneNode(true);
  exported.setAttribute('width', width)
  exported.setAttribute('height', height)
  exported.setAttribute('viewBox', `0 0 ${width} ${height}`)
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
