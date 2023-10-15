export class Cell {
  _x = 0;
  _y = 0;
  _width = 0;
  _height = 0;
  visited = false;
  neighbours = [];
  totalVisited = 0;
  connect;
  constructor(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  set width(value) {
    this._width = value;
  }

  get width() {
    return this._width;
  }

  set height(value) {
    this._height = value;
  }

  get height() {
    return this._height;
  }

  set x(value) {
    this._x = value;
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;
  }

  get y() {
    return this._y;
  }
}

export default class Grid {
  _grid = [];
  columns = undefined;
  rows = undefined;
  _cellWidth = 0;
  _cellHeight = 0;
  _x = 0;
  _y = 0;
  cells = []

  constructor(settings) {
    this._x = settings.x || 0;
    this._y = settings.y || 0;
    this._cellWidth = settings.cellWidth;
    this._cellHeight = settings.cellHeight || settings.cellWidth;

    this.columns = settings.columns;
    this.rows = settings.rows;

    for (let x = 0; x < this.columns; x++) {
      this._grid[x] = [];
      for (let y = 0; y < this.rows; y++) {
        let cell = new Cell(
          this._x + x * this._cellWidth,
          this._y + y * this._cellHeight,
          this._cellWidth,
          this._cellHeight
        );
        this._grid[x][y] = cell;
        this.cells.push(cell)
      }
    }

    this.calcualteNeighbours();
  }

  calcualteNeighbours() {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        let cell = this._grid[x][y]

        if (x > 0) {
          cell.left = this._grid[x - 1][y];
          cell.neighbours.push(cell.left);
        }

        if (x < this.columns - 1) {
          cell.right = this._grid[x + 1][y];
          cell.neighbours.push(cell.right);
        }

        if (y < this.rows - 1) {
          cell.bottom = this._grid[x][y + 1];
          cell.neighbours.push(cell.bottom);
        }

        if (y > 0) {
          cell.up = this._grid[x][y - 1];
          cell.neighbours.push(cell.up);
        }

        this._grid[x][y] = cell;
      }
    }
  }

  get grid() {
    return this._grid;
  }

  set cellWidth(value) {
    this._cellWidth = value;
  }

  get cellWidth() {
    return this._cellWidth;
  }

  set cellHeight(value) {
    this._cellHeight = value;
  }

  get cellHeight() {
    return this._cellHeight;
  }

  set x(value) {
    this._x = value;
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;
  }

  get y() {
    return this._y;
  }
}
