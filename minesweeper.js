/*
*
* "board" is a matrix that holds data about the
* game board, in a form of BoardSquare objects
*
* openedSquares holds the position of the opened squares
*
* flaggedSquares holds the position of the flagged squares
*
 */
let board = [];
let openedSquares = [];
let flaggedSquares = [];
let rowCount = null;
let colCount = null;
let bombCount = 0;
let allBombs = 0;
let squaresLeft = 0;


/*
*
* the probability of a bomb in each square
*
 */
let bombProbability = 3;
let maxProbability = 15;


function minesweeperGameBootstrapper(difficulty) {
    let difficulties = {
        'easy': {
            'rowCount': 9,
            'colCount': 9,
            'bombCount': 10
        },
        'medium': {
            'rowCount': 16,
            'colCount': 16,
            'bombCount': 40
        },
        'expert': {
            'rowCount': 16,
            'colCount': 30,
            'bombCount': 99
        }
    };

    const selectedDifficulty = difficulties[difficulty];

    console.log(selectedDifficulty);
    rowCount = selectedDifficulty.rowCount;
    colCount = selectedDifficulty.colCount;
    bombCount = selectedDifficulty.bombCount;
    generateBoard({ 'rowCount': rowCount, 'colCount': colCount })
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        board[i] = new Array(boardMetadata.colCount);
        for (let j = 0; j < boardMetadata.colCount; j++) {
            board[i][j] = new BoardSquare(false, 0)
        }
    }

    for (let i = 0; i < bombCount; i++) {
        let row, col;
        row = Math.floor(Math.random() * boardMetadata.rowCount);
        col = Math.floor(Math.random() * boardMetadata.colCount);
        if (!board[row][col].hasBomb) {
            board[row][col].hasBomb = true;
        }

    }

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            if (!board[i][j].hasBomb) {
                let bombCount = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const x = i + dx;
                        const y = j + dy;
                        if (x >= 0 && x < boardMetadata.rowCount && y >= 0 && y < boardMetadata.colCount && board[x][y].hasBomb) {
                            bombCount++;
                        }
                    }
                }
                board[i][j].bombsAround = bombCount;
            }
        }
    }

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            if (!board[i][j].hasBomb) {
                allBombs += 1;
            }
        }
    }

    console.log(board);
}


let gameOver = false;
let gameWon = false;

function handleTile(row, col) {
    if (!gameOver) {

        if (board[row][col].hasBomb) {
            gameOver = true;
            console.log('Game Over! You clicked a bomb.');
        } else {
            openTile(row, col);
        }
        checkWin();
    }
    if (gameOver) {
        document.getElementById("resetButton").style.display = "block";
    }
}

function checkWin() {
    let allNonBombTilesOpened = true;
    let allBombsFlagged = true;

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            const square = board[i][j];
            if (!square.hasBomb && !square.isOpen) {
                allNonBombTilesOpened = false;
            }
            if (square.hasBomb && !square.isFlagged) {
                allBombsFlagged = false;
            }
        }
    }

    if (allNonBombTilesOpened && allBombsFlagged) {
        gameWon = true;
        console.log('Congratulations! You won!');
    }
}

function openTile(row, col) {

    if (!board[row][col].isOpen) {
        board[row][col].isOpen = true;
        squaresLeft--;

        if (board[row][col].bombsAround == 0) {
            const neighbors = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];

            for (const [dx, dy] of neighbors) {
                const x = row * 1 + dx;
                const y = col * 1 + dy;

                if (isValidTile(x, y)) {
                    console.log(x, y);
                    openTile(x, y);
                }
            }

        }

        const coords = `${row},${col}`;
        if (openedSquares.indexOf(coords) === -1) {
            openedSquares.push(coords);
        }

        if (squaresLeft === allBombs) {
            gameWon = true;
            checkWin();
        }
        console.log('Opened Squares:', openedSquares);
        console.log(board);
    }
    else {
        return;
    }
}

function isValidTile(row, col) {

    if (col >= 0 && col < colCount && row >= 0 && row < rowCount) {
        return true;
    }

    return false;
    console.log("something")

}

function checkWin() {
    if (gameWon) {
        console.log("")
    }
}



function flagTile(row, col) {
    if (!gameOver) {
        const possibleFlags = allBombs;
        const square = board[row][col];

        if (!square.isOpen && possibleFlags >= flaggedSquares.length) {
            square.isFlagged = !square.isFlagged;

            const coords = `${row},${col}`;
            const index = flaggedSquares.indexOf(coords);

            if (square.isFlagged) {
                if (index === -1) {
                    flaggedSquares.push(coords);
                }
            } else {
                if (index !== -1) {
                    flaggedSquares.splice(index, 1);
                }
            }

            if (square.isFlagged) {
                console.log(`Flagged square at (${row}, ${col})`);
                console.log('Flagged Squares:', flaggedSquares);
            } else {
                console.log(`Unflagged square at (${row}, ${col})`);
                console.log('Flagged Squares:', flaggedSquares);
            }
        }
        else {
            console.log("You can't flag more tiles than the number of bombs")
        }
    }
}

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
        this.isOpen = false;
        this.isFlagged = false;
    }
}


