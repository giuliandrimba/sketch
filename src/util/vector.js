"use strict";

exports.new = function() {
  return {
    x: 0,
    y: 0
  };
};

exports.normalize = function(vec) {
  var m = exports.mag(vec);

  if (m !== 0 && m !== 1) return exports.div(vec, m);

  return vec;
};

exports.copy = function(vec) {
  return {
    x: vec.x,
    y: vec.y
  };
};

exports.mag = function(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
};

exports.magSq = function(vec) {
  return vec.x * vec.x + vec.y * vec.y;
};

exports.add = function(vec1, vec2) {
  return {
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y
  };
};

exports.sub = function(vec1, vec2) {
  return {
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y
  };
};

exports.mult = function(vec1, n) {
  return {
    x: vec1.x * n,
    y: vec1.y * n
  };
};

exports.div = function(vec1, n) {
  return {
    x: vec1.x / n,
    y: vec1.y / n
  };
};

exports.dist = function(vec1, vec2) {
  var dx = vec1.x - vec2.x;
  var dy = vec1.y - vec2.y;

  return Math.sqrt(dx * dx + dy * dy);
};

exports.dot = function(vec1, vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
};

exports.limit = function(vec1, max) {
  if (exports.mag(vec1) > max) {
    var vec1 = exports.normalize(vec1);
    return exports.mult(vec1, max);
  }
};

exports.angle_between = function(vec1, vec2) {
  if (vec1.x === 0 && vec1.y === 0) return 0;

  if (vec2.x === 0 && vec2.y === 0) return 0;

  var dot = exports.dot(vec1, vec2);
  var vec1Mag = exports.mag(vec1);
  var vec2Mag = exports.mag(vec2);

  var amt = dot / (vec1Mag * vec2Mag);

  if (amt < -1) return Math.PI;
  else if (amt > 1) return 0;

  return Math.acos(amt);
};
