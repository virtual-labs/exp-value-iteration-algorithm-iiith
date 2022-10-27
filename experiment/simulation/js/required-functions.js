export const DIRECTIONS = { UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 };
const minDifference = 0.001;

DIRECTIONS.toString = function (x) {
  switch (x) {
    case DIRECTIONS.UP:
      return "up";
    case DIRECTIONS.DOWN:
      return "down";
    case DIRECTIONS.LEFT:
      return "left";
    case DIRECTIONS.RIGHT:
      return "right";
    default:
      return "unknown";
  }
}

export const getDirection = (i, j, grid, R=0, valueForTerminal = undefined) => {
  const {
    up,
    rewardUP,
    left,
    rewardLeft,
    right,
    rewardRight,
    down,
    rewardDown,
  } = getNeighborValues(i, j, R, grid, 0, valueForTerminal);

  const upValue = up;
  const leftValue = left;
  const rightValue = right;
  const downValue =  down;

  const max = Math.max(upValue, leftValue, rightValue, downValue);

  if (max === leftValue) return DIRECTIONS.LEFT;
  else if (max === rightValue) return DIRECTIONS.RIGHT;
  else if (max === downValue) return DIRECTIONS.DOWN;
  else return DIRECTIONS.UP;
}

export function makeGrid(x, y = -1) {
  if (y == -1) {
    y = x;
  }
  const grid = [];
  for (var i = 0; i < x; i++) {
    grid[i] = [];
    for (let j = 0; j < y; j++) {
      grid[i][j] = 0;
    }
  }
  grid.finalStates = [];
  grid.completed = false;
  grid.size = [x, y];
  return grid;
}


export function addFinalStates(x, y, value, grid) {
  const newGrid = structuredClone(grid);
  newGrid.finalStates.push({ x: x, y: y, value: value });
  newGrid[x][y] = value;
  return newGrid;
}
export function addObstacles(x, y, value=-2, grid) {
  const newGrid = structuredClone(grid);
  newGrid[x][y] = value;
  return newGrid;
}

export const isObstacle = (x, y, grid) => {
  return grid[x][y] === -2;
};

export const isTerminalState = (i, j, grid) => {
  return grid.finalStates.some(state => state.x == i && state.y == j);
};

export const getFinalStates = (grid) => {
  return grid.finalStates;
};
function isValidNeighbour(i, j, grid) {
  return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && !isObstacle(i, j, grid);
}
export function getNeighbours(i, j, grid)
{
  const neighbours = [];
  if (isValidNeighbour(i - 1, j, grid)) {
    neighbours.push({ x: i - 1, y: j });
  }
  if (isValidNeighbour(i, j + 1, grid)) {
    neighbours.push({ x: i, y: j + 1 });
  }
  if (isValidNeighbour(i, j - 1, grid)) {
    neighbours.push({ x: i, y: j - 1 });
  }
  if (isValidNeighbour(i + 1, j, grid)) {
    neighbours.push({ x: i + 1, y: j });
  }
  return neighbours;
}
function getNeighborValues(
  i,
  j,
  R,
  grid,
  defaultCellValue = 0,
  valueForTerminal = undefined
) {
  const upCellValue = isValidNeighbour(i - 1, j, grid)
    ? grid[i - 1][j]
    : defaultCellValue;
  const rightCellValue = isValidNeighbour(i, j + 1, grid)
    ? grid[i][j + 1]
    : defaultCellValue;
  const leftCellValue = isValidNeighbour(i, j - 1, grid)
    ? grid[i][j - 1]
    : defaultCellValue;
  const bottomCellValue = isValidNeighbour(i + 1, j, grid)
    ? grid[i + 1][j]
    : defaultCellValue;

  return {
    up: isTerminalState(i - 1, j, grid)
      ? valueForTerminal === 0
        ? valueForTerminal
        : grid[i - 1][j] === 1
          ? 1
          : -1
      : upCellValue,
    rewardUP: isTerminalState(i - 1, j, grid)
      ? grid[i - 1][j] === 1
        ? 1
        : -1
      : R,
    left: isTerminalState(i, j - 1, grid)
      ? valueForTerminal === 0
        ? valueForTerminal
        : grid[i][j - 1] === 1
          ? 1
          : -1
      : leftCellValue,
    rewardLeft: isTerminalState(i, j - 1, grid)
      ? grid[i][j - 1] === 1
        ? 1
        : -1
      : R,
    right: isTerminalState(i, j + 1, grid)
      ? valueForTerminal === 0
        ? valueForTerminal
        : grid[i][j + 1] === 1
          ? 1
          : -1
      : rightCellValue,
    rewardRight: isTerminalState(i, j + 1, grid)
      ? grid[i][j + 1] === 1
        ? 1
        : -1
      : R,
    down: isTerminalState(i + 1, j, grid)
      ? valueForTerminal === 0
        ? valueForTerminal
        : grid[i + 1][j] === 1
          ? 1
          : -1
      : bottomCellValue,
    rewardDown: isTerminalState(i + 1, j, grid)
      ? grid[i + 1][j] === 1
        ? 1
        : -1
      : R,
  };
}
export function nextCell(x, y, grid)
{
  const [maxX, maxY] = grid.size;
  var newX, newY;
  if (y >= maxY - 1) {
    if(x >= maxX - 1)
      return [0, 0];
    newX = x + 1;
    newY = 0;
  } else {
    newX = x;
    newY = y + 1;
  }

  while(isTerminalState(newX, newY, grid) || isObstacle(newX, newY, grid)) {
    x = newX;
    y = newY;
    if (y >= maxY - 1) {
      if(x >= maxX - 1)
        return [0, 0];
      newX = x + 1;
      newY = 0;
    } else {
      newX = x;
      newY = y + 1;
    }
  }
  return [newX, newY];
}
export const calculateNewValue = (x, y, reward=0, gamma=0.9, grid, returnValue = 1) => {
  if(returnValue === 0)
  {
    return getNeighborValues(x, y, reward, grid, 0, 0);
  }
  const {
    up,
    down,
    left,
    right,
    rewardDown,
    rewardLeft,
    rewardRight,
    rewardUP,
  } = getNeighborValues(x, y, reward, grid, 0, 0);
  // console.log(up + " " + down + " " + left + " " + right + " " + rewardUP + " " + rewardLeft + " " + rewardRight + " " + rewardDown);
  const result = [];

  result.push(
    0.8 * (rewardUP + gamma * up) +
    0.1 * (rewardRight + gamma * right) +
    0.1 * (rewardLeft + gamma * left)
  );

  result.push(
    0.8 * (rewardDown + gamma * down) +
    0.1 * (rewardRight + gamma * right) +
    0.1 * (rewardLeft + gamma * left)
  );

  result.push(
    0.8 * (rewardRight + gamma * right) +
    0.1 * (rewardUP + gamma * up) +
    0.1 * (rewardDown + gamma * down)
  );

  result.push(
    0.8 * (rewardLeft + gamma * left) +
    0.1 * (rewardUP + gamma * up) +
    0.1 * (rewardDown + gamma * down)
  );
  // console.log(result);
  // max of the values
  const max = Math.max(...result);

  return max;
};

export const completedOrNot = (grid, newGrid) =>
{
  var diff = 1000;
  const size = newGrid.size;
  for (let j = 0; j < size[0]; j++) {
    for (let k = 0; k < size[1]; k++) {
      diff = Math.max(diff, Math.abs(grid[j][k] - newGrid[j][k]));
    }
  }
  if( diff < minDifference) {
    console.log("Minimum difference reached");
    newGrid.completed = true;
    return true;
  }
  return false;
}

export const valueIteration = (grid, reward=0, discountFactor=0.9) => {

  var newGrid = structuredClone(grid);
  const size = newGrid.size;
  const maxIterations = 1;
  const minDifference = 0.001;


  for (let i = 0; i < maxIterations; i++) {
    const tempGrid = structuredClone(newGrid);
    let difference = 0;
    for (let j = 0; j < size[0]; j++) {
      for (let k = 0; k < size[1]; k++) {
        if (newGrid[j][k] != 1 && newGrid[j][k] != -1 && !isObstacle(j, k, newGrid)) {
          const newValue = calculateNewValue(
            j,
            k,
            reward,
            discountFactor,
            newGrid
          );
          // console.log(newValue);
          tempGrid[j][k] = newValue;
          difference = Math.max(difference, Math.abs(newValue - newGrid[j][k]));

        }
      }
    }
    newGrid = structuredClone(tempGrid);
    if( difference < minDifference) {
      console.log("Minimum difference reached");
      newGrid.completed = true;
      break;
    }
    
    // if (i == maxIterations - 1) {
    //   console.log("Max iterations reached");
    // }
  }
  return newGrid;
};
