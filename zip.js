function trimZipCellContent(content) {
    const parts = content.split("\n");
    const newContent = parts.join('');
    return newContent.trim();
}

function areAllValuesTrue(arr) {
  if (arr.length === 0) {
    return true;
  }
  return arr.every(value => value === true);
}

function solveZip(adjMap, checkPointMap, visited, atNode, moveList, lastCheckPoint) {
  if (visited[atNode] || (checkPointMap.get(atNode) !== undefined && Number(checkPointMap.get(atNode)) !== lastCheckPoint + 1)) {
    return null;
  }

  visited[atNode] = true;
  if (checkPointMap.get(atNode) !== undefined) {
    lastCheckPoint++;
  }

  moveList.push(atNode);

  if (areAllValuesTrue(visited)) {
    const result = [...moveList];
    visited[atNode] = false;
    moveList.pop();
    return result;
  }

  const [up, down, left, right] = adjMap.get(atNode);

  const candidates = [];
  if (up !== null) {
    candidates.push(solveZip(adjMap, checkPointMap, visited, up, moveList, lastCheckPoint));
  }
  if (down !== null) {
    candidates.push(solveZip(adjMap, checkPointMap, visited, down, moveList, lastCheckPoint));
  }
  if (left !== null) {
    candidates.push(solveZip(adjMap, checkPointMap, visited, left, moveList, lastCheckPoint));
  }
  if (right !== null) {
    candidates.push(solveZip(adjMap, checkPointMap, visited, right, moveList, lastCheckPoint));
  }

  visited[atNode] = false;
  moveList.pop();

  const valid = candidates.filter(x => x !== null);

  if (valid.length === 0) {
    return null;
  }

  valid.sort((a, b) => b.length - a.length);
  return valid[0];
}

function runZipGame() {
  const boardNodes = document.querySelectorAll("div.trail-cell");
  const sideLength = Math.sqrt(boardNodes.length);
  const checkPointMap = new Map();
  let atNode = -1;
  for (let i = 0; i < boardNodes.length; i++) {
    if (boardNodes[i].querySelector("div.trail-cell-content")) {
      const contentNode = boardNodes[i];
      const content = contentNode.querySelector("div.trail-cell-content").textContent;
      checkPointMap.set(i, trimZipCellContent(content));
      if (trimZipCellContent(content) === "1") {
        atNode = i;
      }
    }
  }
  const adjMap = new Map();
  const removeList = [];
  for (let space = 0; space < boardNodes.length; space++) {
    const spaceMoves = [];
    if (space - sideLength >= 0) {
      spaceMoves.push(space - sideLength);
    } else {
      spaceMoves.push(null);
    }
    if (space + sideLength < boardNodes.length && !boardNodes[space].querySelector("div.trail-cell-wall--down")) {
      spaceMoves.push(space + sideLength);
    } else {
      if (boardNodes[space].querySelector("div.trail-cell-wall--down")) {
        removeList.push([space + sideLength, 0]);
      }
      spaceMoves.push(null);
    }
    if ((space - 1) % sideLength < space % sideLength && space - 1 >= 0 && !boardNodes[space].querySelector("div.trail-cell-wall--left")) {
      spaceMoves.push(space - 1);
    } else {
      if (boardNodes[space].querySelector("div.trail-cell-wall--left")) {
        removeList.push([space - 1, 3]);
      }
      spaceMoves.push(null);
    }
    if ((space + 1) % sideLength > space % sideLength && !boardNodes[space].querySelector("div.trail-cell-wall--right")) {
      spaceMoves.push(space + 1);
    } else {
      if (boardNodes[space].querySelector("div.trail-cell-wall--right")) {
        removeList.push([space + 1, 2]);
      }
      spaceMoves.push(null);
    }
    adjMap.set(space, spaceMoves);
  }
  for (const removal of removeList) {
    adjMap.get(removal[0])[removal[1]] = null;
  }
  const visited = new Array(boardNodes.length).fill(false);
  const answer = solveZip(adjMap, checkPointMap, visited, atNode, [], 0);
  answer.shift();
  console.log(answer);
  answer.forEach((element) => {
    simulateClick(boardNodes[element], 1);
  });
}

startGame("zip");