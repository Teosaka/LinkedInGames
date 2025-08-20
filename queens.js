function runQueensGame() {
  const cells = document.querySelectorAll("div.queens-cell-with-border");
  const dimension = Math.sqrt(cells.length);

  const colorMap = new Map();
  const colorToIndexMap = new Map();

  for (let i = 0; i < cells.length; i++) {
    const colorNum = cells[i].classList[1].substring(11);
    colorMap.set(i, colorNum);
    if (!colorToIndexMap.has(colorNum)) {
      colorToIndexMap.set(colorNum, []);
    }
    colorToIndexMap.get(colorNum).push(i);
  }

  const answer = solve(
    [],
    new Set(),
    new Set(),
    new Set(),
    colorMap,
    colorToIndexMap,
    dimension
  );

  if (answer) {
    for (const cell of answer) {
      simulateClick(cells[cell], 2);
    }
  }
}

function solve(
  queenArr,
  usedRows,
  usedCols,
  usedColors,
  colorMap,
  colorToIndexMap,
  dimension
) {
  if (queenArr.length === dimension) {
    return [...queenArr];
  }

  for (const [color, cells] of colorToIndexMap.entries()) {
    if (usedColors.has(color)) continue;

    const options = cells.filter((cell) => isCellValid(cell, queenArr, usedRows, usedCols, dimension));
    if (options.length === 0) return null;

    if (options.length === 1) {
      const cell = options[0];
      const row = Math.floor(cell / dimension);
      const col = cell % dimension;

      queenArr.push(cell);
      usedRows.add(row);
      usedCols.add(col);
      usedColors.add(color);

      const res = solve(queenArr, usedRows, usedCols, usedColors, colorMap, colorToIndexMap, dimension);
      if (res) return res;

      queenArr.pop();
      usedRows.delete(row);
      usedCols.delete(col);
      usedColors.delete(color);
      return null;
    }
  }

  let nextColor = null;
  let bestOptions = null;

  for (const [color, cells] of colorToIndexMap.entries()) {
    if (usedColors.has(color)) continue;

    const options = cells.filter((cell) => isCellValid(cell, queenArr, usedRows, usedCols, dimension));
    if (options.length === 0) return null;

    if (!bestOptions || options.length < bestOptions.length) {
      nextColor = color;
      bestOptions = options;
    }
  }

  for (const cell of bestOptions) {
    const row = Math.floor(cell / dimension);
    const col = cell % dimension;

    queenArr.push(cell);
    usedRows.add(row);
    usedCols.add(col);
    usedColors.add(nextColor);

    const res = solve(queenArr, usedRows, usedCols, usedColors, colorMap, colorToIndexMap, dimension);
    if (res) return res;

    queenArr.pop();
    usedRows.delete(row);
    usedCols.delete(col);
    usedColors.delete(nextColor);
  }

  return null;
}

function isCellValid(cell, queenArr, usedRows, usedCols, dimension) {
  const row = Math.floor(cell / dimension);
  const col = cell % dimension;

  if (usedRows.has(row) || usedCols.has(col)) return false;

  return !isAdjacent(cell, queenArr, dimension);
}

function isAdjacent(newCell, queenArr, dimension) {
  const r1 = Math.floor(newCell / dimension);
  const c1 = newCell % dimension;
  for (const q of queenArr) {
    const r2 = Math.floor(q / dimension);
    const c2 = q % dimension;
    if (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) {
      return true;
    }
  }
  return false;
}

startGame("queens");