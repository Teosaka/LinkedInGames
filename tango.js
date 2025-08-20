function runTangoGame() {
  const cells = document.querySelectorAll("div.lotka-cell");
  const dimension = Math.sqrt(cells.length);
  const board = Array(cells.length).fill(null);

  const equalCells = new Map();
  const oppCells = new Map();

  function addConstraint(map, a, b) {
    if (!map.has(a)) map.set(a, []);
    map.get(a).push(b);
  }

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].querySelector("g#Sun")) board[i] = "S";
    if (cells[i].querySelector("g#Moon")) board[i] = "M";

    const rightEdge = cells[i].querySelector("div.lotka-cell-edge--right");
    if (rightEdge) {
      const right = i + 1;
      if (cells[i].querySelector("path#\\=")) addConstraint(equalCells, i, right);
      else if (rightEdge.querySelector("title")?.textContent === "Cross") addConstraint(oppCells, i, right);
    }

    const downEdge = cells[i].querySelector("div.lotka-cell-edge--down");
    if (downEdge) {
      const down = i + dimension;
      if (cells[i].querySelector("path#\\=")) addConstraint(equalCells, i, down);
      else if (downEdge.querySelector("title")?.textContent === "Cross") addConstraint(oppCells, i, down);
    }
  }
  const copyBoard = [...board];
  console.log(copyBoard);
  console.log(equalCells);
  console.log(oppCells);
  const answer = solve(board, equalCells, oppCells);
  const diff = getArrayDifference(copyBoard, answer);
  for (let move = 0; move < diff.length; move++) {
    if (diff[move] === "M") {
      simulateClick(cells[move], 2);
    } else if (diff[move] === "S") {
      simulateClick(cells[move], 1);
    }
  }
}

function getArrayDifference(original, finished) {
  return finished.map((val, i) => (original[i] === null ? val : null));
}

function solve(board, equalCells, oppCells) {
  if (board.indexOf(null) === -1) {
    return isValidFinal(board, equalCells, oppCells) ? [...board] : null;
  }

  const nextMove = board.indexOf(null);

  for (const val of ["M", "S"]) {
    board[nextMove] = val;

    if (isValidPartial(board, nextMove, equalCells, oppCells)) {
      const result = solve(board, equalCells, oppCells);
      if (result) return result;
    }

    board[nextMove] = null;
  }

  return null;
}

function checkThreeInARowRule(line) {
  for (let i = 2; i < line.length; i++) {
      if (line[i] !== null && line[i] === line[i-1] && line[i] === line[i-2]) {
        return false;
      }
  }
  return true;
}

function checkMatchingOccurRule(line) {
  const count = new Map([
    ["S", 0],
    ["M", 0]
  ]);
  line.forEach((val) => {
    if (val === "S") {
      count.set("S", count.get("S") + 1);
    }
    else if (val === "M") {
      count.set("M", count.get("M") + 1);
    }
  });
  return count.get("S") === count.get("M");
}

function isValidPartial(board, index, equalCells, oppCells) {
  const dimension = Math.sqrt(board.length);
  const val = board[index];
  if (val === null) return true;

  const row = Math.floor(index / dimension);
  const col = index % dimension;

  if (equalCells.has(index)) {
    for (const eq of equalCells.get(index)) {
      if (board[eq] !== null && board[eq] !== val) {
        return false;
      }
    }
  }

  if (oppCells.has(index)) {
    for (const opp of oppCells.get(index)) {
      if (board[opp] !== null && board[opp] === val) {
        return false;
      }
    }
  }

  const rowVals = board.slice(row * dimension, (row + 1) * dimension);
  if (!checkThreeInARowRule(rowVals)) return false;

  const rowCountS = rowVals.filter(v => v === "S").length;
  const rowCountM = rowVals.filter(v => v === "M").length;
  if (rowCountS > dimension / 2 || rowCountM > dimension / 2) return false;

  const colVals = [];
  for (let r = 0; r < dimension; r++) {
    colVals.push(board[r * dimension + col]);
  }
  if (!checkThreeInARowRule(colVals)) return false;

  const colCountS = colVals.filter(v => v === "S").length;
  const colCountM = colVals.filter(v => v === "M").length;
  if (colCountS > dimension / 2 || colCountM > dimension / 2) return false;

  return true;
}

function isValidFinal(board, equalCells, oppCells) {
  const dimension = Math.sqrt(board.length);
  const rowCounts = Array.from({ length: dimension }, () => []);
  const colCounts = Array.from({ length: dimension }, () => []);
  for (let i = 0; i < board.length; i++) {
    if (equalCells.has(i)) {
      for (const equalCell of equalCells.get(i)) {
        if (board[i] !== board[equalCell]) {
          return false;
        }
      }
    }
    if (oppCells.has(i)) {
      for (const oppCell of oppCells.get(i)) {
        if (board[i] === board[oppCell]) {
          return false;
        }
      }
    }
    rowCounts[Math.floor(i / dimension)].push(board[i]);
    colCounts[i % dimension].push(board[i]);
  }
  for (const arr of rowCounts) {
    if (!checkMatchingOccurRule(arr) || !checkThreeInARowRule(arr)) {
      return false;
    }
  }
  for (const arr of colCounts) {
    if (!checkMatchingOccurRule(arr) || !checkThreeInARowRule(arr)) {
      return false;
    }
  }
  return true;
}

startGame("tango");