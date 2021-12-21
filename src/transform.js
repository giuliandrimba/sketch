const SimplexNoise = require('simplex-noise');
const calc = require('@doublepi/calc');

let distortionCircle = {
  x: 0,
  y: 0,
  radius: 250 + Math.random() * 250,
  noiseX: 0,
  noiseY: 0
}

const simplex = new SimplexNoise(Math.random);

exports.distort = (f, sketch) => {
  noise2D = simplex.noise3D(distortionCircle.noiseX += 1, distortionCircle.noiseX += 1);
  // console.log(noise2D)
  distortionCircle.x = sketch.width / 2 ;
  distortionCircle.y = sketch.height / 2;
  
  let flowfield = f.map((c) => {
    let cell = {...c};
    let angle = calc.ang(distortionCircle.x, distortionCircle.y, cell.x, cell.y)
    angle = calc.deg2rad(angle)
    let dist = calc.dist(distortionCircle.x, distortionCircle.y, cell.x, cell.y);

    if (dist < distortionCircle.radius * 2) {
      cell.x = distortionCircle.x + Math.sin(angle) * distortionCircle.radius + dist * Math.random();
      cell.y = distortionCircle.y + Math.cos(angle) * distortionCircle.radius + dist * 0.1 ;
    } else {
      // cell.x = distortionCircle.x + Math.sin(angle) * distortionCircle.radius + dist * 0.01;
      cell.y = distortionCircle.y + Math.cos(angle) * distortionCircle.radius + dist * Math.random() ;
    }
    return cell;
  })

  return flowfield;
}

exports.point = () => {
  return distortionCircle
}