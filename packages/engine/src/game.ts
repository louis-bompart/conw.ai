export class GameOfLife {
  width: number;
  height: number;
  grid: boolean[][];

  constructor(width: number, height: number, initialState: string = "") {
    this.width = width;
    this.height = height;
    if (initialState) {
      const decompressed = decompressFromSafeString(initialState);
      this.grid = this.createGrid(decompressed);
    } else {
      this.grid = this.createGrid();
    }
  }

  createGrid(initialState: boolean[] = []): boolean[][] {
    const arr = Array.from(initialState).reverse();
    return Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => arr.pop()));
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

  toBitString(): string {
    return this.grid.map(row => row.map(cell => cell ? '1' : '0').join('')).join('');
  }

  toString(): string {
    return compressToSafeString(this.toBitString());
  }

  clear(): void {
    this.grid = this.createGrid();
  }
}

function compressToSafeString(binaryStr: string) {
  // 1. Pack the bits into an array of bytes
  const bytes = new Uint8Array(Math.ceil(binaryStr.length / 8));
  for (let i = 0; i < binaryStr.length; i++) {
    if (binaryStr[i] === '1') bytes[Math.floor(i / 8)] |= (1 << (7 - (i % 8)));
  }

  // 2. Convert the byte array into a Base64 string
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

  // 3. Return the Base64 string + the original length (needed for accurate decompression)
  return btoa(binString) + "-" + binaryStr.length;
}

function decompressFromSafeString(compressedStr: string) {
  // 1. Split the Base64 string from the original length
  const [base64, lengthStr] = compressedStr.split('-');
  const originalLength = parseInt(lengthStr, 10);

  // 2. Decode Base64 back into raw bytes
  const binString = atob(base64);

  // 3. Unpack the bits back into 1s and 0s
  let result: boolean[] = [];
  for (let i = 0; i < originalLength; i++) {
    const byteIndex = Math.floor(i / 8);
    const bit = Boolean(binString.charCodeAt(byteIndex) & (1 << (7 - (i % 8))));
    result.push(bit);
  }

  return result;
}