const sketch = require("canvas-sketch");
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
import Grid from './Grid.js'
import line, { drawGrid } from './display/line.js';
import createMaze from './Maze.js';

const settings = {
  dimensions: 'A3',
  orientation: 'portrait',
  pixelsPerInch: 72,
  scaleToView: false,
  units: 'cm',
};

let ctx;

window.onload = () => {
  sketch((s) => {
    ctx = s.context;

    let _cellWidth = s.width / 8;
    let _cellHeight = s.width / 8;
    let _x = s.width / 2 - (s.width / 16 * 4);
    let _y = s.height / 2 - (s.height / 16 * 4);

    let gridSettings = {
      cellWidth: _cellWidth,
      cellHeight: _cellHeight,
      x: _x,
      y: _y + 3,
      columns: 5,
      rows: 5
    }

    let grid = new Grid(gridSettings);
    createMaze(grid, { x: 0, y: 0 })
    let paths = line(ctx, grid)
    let lines = pathsToPolylines(paths, { units: 'cm' });
    // drawGrid(ctx, grid)
    const margin = 1; // in working 'units' based on settings
    const box = [ margin, margin, s.width - margin, s.height - margin ];
    lines = clipPolylinesToBox(lines, box);

    return props => renderPaths(lines, {
      ...props,
      lineJoin: 'round',
      lineCap: 'round',
      // in working units; you might have a thicker pen
      lineWidth: .1,
      // Optimize SVG paths for pen plotter use
      optimize: true
    });
  }, settings);
};
