interface iResult {
  path: string;
  letters: string;
}

enum DirectionENUM {
  RIGHT = "right",
  DOWN = "down",
  UP = "up",
  LEFT = "left",
  BLANK = "",
}

interface IDR_DC {
  dr: number;
  dc: number;
}

type followPathFnType = (grid: string[][]) => iResult;

const oppositeDirection: (dir: DirectionENUM) => DirectionENUM = (
  dir: DirectionENUM
) => {
  switch (dir) {
    case DirectionENUM.UP:
      return DirectionENUM.DOWN;
    case DirectionENUM.DOWN:
      return DirectionENUM.UP;
    case DirectionENUM.LEFT:
      return DirectionENUM.RIGHT;
    case DirectionENUM.RIGHT:
      return DirectionENUM.LEFT;
    default:
      return DirectionENUM.BLANK;
  }
};

const perpendicularDirectionsTo: (dir: DirectionENUM) => DirectionENUM[] = (
  dir: DirectionENUM
) => {
  switch (dir) {
    case DirectionENUM.UP:
    case DirectionENUM.DOWN:
      return [DirectionENUM.LEFT, DirectionENUM.RIGHT];
    case DirectionENUM.LEFT:
    case DirectionENUM.RIGHT:
      return [DirectionENUM.UP, DirectionENUM.DOWN];
    default:
      return [];
  }
};

// Main function to follow the path
const followPath: followPathFnType = (grid: string[][]) => {
  //  Find the starting point
  let startRow: number = grid.findIndex((row) => row.includes(">"));
  let startCol: number = startRow !== -1 ? grid[startRow].indexOf(">") : -1;

  // Initialize direction and path
  let direction: DirectionENUM = DirectionENUM.RIGHT,
    path: string = "",
    letters: string = "";

  // Pin Current position
  let row: number = startRow;
  let col: number = startCol;

  // Define the possible movements
  const movements: {
    [key: string]: IDR_DC;
  } = {
    right: { dr: 0, dc: 1 },
    left: { dr: 0, dc: -1 },
    up: { dr: -1, dc: 0 },
    down: { dr: 1, dc: 0 },
  };

  // Loop through the grid
  while (grid[row] && grid[row][col] && grid[row][col] !== "s") {
    const currentChar: string = grid[row][col];
    path += currentChar;

    // Collect letters
    if (currentChar >= "A" && currentChar <= "Z") {
      letters += currentChar;
    }

    // Handle direction changes
    if (currentChar === "+") {
      const possibleDirections: DirectionENUM[] = [
        DirectionENUM.UP,
        DirectionENUM.DOWN,
        DirectionENUM.LEFT,
        DirectionENUM.RIGHT,
      ].filter((dir) => dir !== oppositeDirection(direction));

      for (const dir of possibleDirections) {
        const nextRow: number = row + movements[dir].dr;
        const nextCol: number = col + movements[dir].dc;

        if (
          grid[nextRow] &&
          grid[nextRow][nextCol] &&
          grid[nextRow][nextCol] !== " "
        ) {
          direction = dir;
          break;
        }
      }
    } else {
      const nextRow: number = row + movements[direction].dr;
      const nextCol: number = col + movements[direction].dc;

      if (
        !grid[nextRow] ||
        !grid[nextRow][nextCol] ||
        grid[nextRow][nextCol] === " "
      ) {
        const perpendicularDirections: DirectionENUM[] =
          perpendicularDirectionsTo(direction);

        for (const dir of perpendicularDirections) {
          const nextRow: number = row + movements[dir].dr;
          const nextCol: number = col + movements[dir].dc;

          if (
            grid[nextRow] &&
            grid[nextRow][nextCol] &&
            grid[nextRow][nextCol] !== " "
          ) {
            direction = dir;
            break;
          }
        }
      }
    }

    // Move to the next cell
    const move: IDR_DC = movements[direction];
    row += move.dr;
    col += move.dc;
  }

  // Add the final 's' character to the path
  if (grid[row] && grid[row][col] === "s") {
    path += "s";
  }

  return {
    path,
    letters,
  };
};

// Example usage:
const example1: string[][] = [
  [">", "-", "-", "-", "A", "-", "-", "-", "+"],
  ["", "", "", "", "", "", "", "", "|"],
  ["s", "-", "B", "-", "+", "", "", "", "C"],
  ["", "", "", "", "|", "", "", "", "|"],
  ["", "", "", "", "+", "-", "-", "-", "+"],
];

const result1: iResult = followPath(example1);
console.log("Path:", result1.path); 
console.log("Letters:", result1.letters); 

const example2: string[][] = [
  [">", "-", "-", "-", "A", "-", "@", "-", "+"],
  ["", "", "", "", "", "", "", "", "|"],
  ["+", "-", "U", "-", "+", "", "", "", "C"],
  ["|", "", "", "", "|", "", "", "", "|"],
  ["s", "", "", "", "C", "-", "-", "-", "+"],
];

const result2: iResult = followPath(example2);
console.log("Path:", result2.path); 
console.log("Letters:", result2.letters); 
