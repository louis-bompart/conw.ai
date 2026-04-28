export class GameOfLife {
  width: number;
  height: number;
  grid: boolean[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
  }

  createGrid(): boolean[][] {
    return Array.from({ length: this.height }, () => new Array(this.width).fill(false));
  }

  toggleCell(x: number, y: number): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = !this.grid[y][x];
    }
  }

  setCell(x: number, y: number, state: boolean): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = state;
    }
  }

  getCell(x: number, y: number): boolean {
    // We treat out-of-bounds as dead cells
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.grid[y][x];
    }
    return false;
  }

  countNeighbors(x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (this.getCell(nx, ny)) {
          count++;
        }
      }
    }
    return count;
  }

  tick(): void {
    const newGrid = this.createGrid();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const isAlive = this.grid[y][x];
        const neighbors = this.countNeighbors(x, y);

        if (isAlive) {
          if (neighbors === 2 || neighbors === 3) {
            newGrid[y][x] = true;
          } else {
            newGrid[y][x] = false;
          }
        } else {
          if (neighbors === 3) {
            newGrid[y][x] = true;
          }
        }
      }
    }

    this.grid = newGrid;
  }

  clear(): void {
    this.grid = this.createGrid();
  }
}
