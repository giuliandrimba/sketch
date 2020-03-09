function noiseFunc( v ){
  var s  = noise.simplex3( v.x, v.y, v.z );
  var s1 = noise.simplex3( v.y - 19.1, v.z + 33.4, v.x + 47.2 );
  var s2 = noise.simplex3( v.z + 74.2, v.x - 124.5, v.y + 99.4 );
  return new THREE.Vector3( s , s1 , s2 );
}

var e = .1;
var dx = new THREE.Vector3( e   , 0.0 , 0.0 );
var dy = new THREE.Vector3( 0.0 , e   , 0.0 );
var dz = new THREE.Vector3( 0.0 , 0.0 , e   );

var tmp = new THREE.Vector3();
var res = new THREE.Vector3();

module.exports = curlNoise;
function curlNoise (p) {
  p.x += ( .5 - Math.random() ) * .0;
  p.y += ( .5 - Math.random() ) * .0;
  p.z += ( .5 - Math.random() ) * .0;

  var p_x0 = noiseFunc( tmp.copy( p ).sub( dx ) );
  var p_x1 = noiseFunc( tmp.copy( p ).add( dx ) );
  var p_y0 = noiseFunc( tmp.copy( p ).sub( dy ) );
  var p_y1 = noiseFunc( tmp.copy( p ).add( dy ) );
  var p_z0 = noiseFunc( tmp.copy( p ).sub( dz ) );
  var p_z1 = noiseFunc( tmp.copy( p ).add( dz ) );

  var x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  var y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  var z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  var divisor = 1.0 / ( 2.0 * e );
  res.set( x, y, z ).multiplyScalar( divisor ).normalize();
  return res;
};
