"use strict";
var DirectionENUM;
(function (DirectionENUM) {
    DirectionENUM["RIGHT"] = "right";
    DirectionENUM["DOWN"] = "down";
    DirectionENUM["UP"] = "up";
    DirectionENUM["LEFT"] = "left";
    DirectionENUM["BLANK"] = "";
})(DirectionENUM || (DirectionENUM = {}));
// Step 1.1 -> Utility function to get opposite direction
const oppositeDirection = (dir) => {
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
// Step 1.2 -> Utility function to get perpendicular directions
const perpendicularDirectionsTo = (dir) => {
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
// step 1.3 -> Main function to follow the path
const followPath = (grid) => {
    // step 1.4 -> Find the starting point
    let startRow = grid.findIndex((row) => row.includes(">"));
    let startCol = startRow !== -1 ? grid[startRow].indexOf(">") : -1;
    // step 2.1 -> Initialize direction and path
    let direction = DirectionENUM.RIGHT, path = "", letters = "";
    // step 2.2 -> Pin Current position
    let row = startRow;
    let col = startCol;
    // step 2.3 -> Define the possible movements
    const movements = {
        right: { dr: 0, dc: 1 },
        left: { dr: 0, dc: -1 },
        up: { dr: -1, dc: 0 },
        down: { dr: 1, dc: 0 },
    };
    // Step 3 -> Loop through the grid
    while (grid[row] && grid[row][col] && grid[row][col] !== "s") {
        const currentChar = grid[row][col];
        path += currentChar;
        // Collect letters
        if (currentChar >= "A" && currentChar <= "Z") {
            letters += currentChar;
        }
        // Handle direction changes
        if (currentChar === "+") {
            const possibleDirections = [
                DirectionENUM.UP,
                DirectionENUM.DOWN,
                DirectionENUM.LEFT,
                DirectionENUM.RIGHT,
            ].filter((dir) => dir !== oppositeDirection(direction));
            for (const dir of possibleDirections) {
                const nextRow = row + movements[dir].dr;
                const nextCol = col + movements[dir].dc;
                if (grid[nextRow] &&
                    grid[nextRow][nextCol] &&
                    grid[nextRow][nextCol] !== " ") {
                    direction = dir;
                    break;
                }
            }
        }
        else {
            const nextRow = row + movements[direction].dr;
            const nextCol = col + movements[direction].dc;
            if (!grid[nextRow] ||
                !grid[nextRow][nextCol] ||
                grid[nextRow][nextCol] === " ") {
                const perpendicularDirections = perpendicularDirectionsTo(direction);
                for (const dir of perpendicularDirections) {
                    const nextRow = row + movements[dir].dr;
                    const nextCol = col + movements[dir].dc;
                    if (grid[nextRow] &&
                        grid[nextRow][nextCol] &&
                        grid[nextRow][nextCol] !== " ") {
                        direction = dir;
                        break;
                    }
                }
            }
        }
        // Move to the next cell
        const move = movements[direction];
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
const example1 = [
    [">", "-", "-", "-", "A", "-", "-", "-", "+"],
    ["", "", "", "", "", "", "", "", "|"],
    ["s", "-", "B", "-", "+", "", "", "", "C"],
    ["", "", "", "", "|", "", "", "", "|"],
    ["", "", "", "", "+", "-", "-", "-", "+"],
];
const result1 = followPath(example1);
console.log("Path:", result1.path); // Expected output: >---A---+|C|+---+|+-B-s
console.log("Letters:", result1.letters); // Expected output: ACB
const example2 = [
    [">", "-", "-", "-", "A", "-", "@", "-", "+"],
    ["", "", "", "", "", "", "", "", "|"],
    ["+", "-", "U", "-", "+", "", "", "", "C"],
    ["|", "", "", "", "|", "", "", "", "|"],
    ["s", "", "", "", "C", "-", "-", "-", "+"],
];
const result2 = followPath(example2);
console.log("Path:", result2.path); // Expected output: >---A-@-+|C|+---C|+-U-+|s
console.log("Letters:", result2.letters); // Expected output: ACCU
