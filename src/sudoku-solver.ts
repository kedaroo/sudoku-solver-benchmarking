import { Board } from './create-sudoku-puzzle';

export const solveSudoku = (board: Board) => {
  const start = performance.now();
  const solvable = solve(board);
  const end = performance.now();

  return {
    solvable,
    timeRequired: Math.round((end - start) * 10) / 10,
  };
};

export const solve = (board: Board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 0) {
        for (let num = 1; num < board.length + 1; num++) {
          if (isValid(board, i, j, num)) {
            board[i][j] = num;

            if (solve(board)) {
              return true;
            } else {
              board[i][j] = 0;
            }
          }
        }

        return false;
      }
    }
  }

  return true;
};

/**
 * Checks if the current number placement satifies all sudoku rules
 */
const isValid = (board: Board, row: number, col: number, num: number) => {
  for (let i = 0; i < board.length; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const subgridSize = Math.sqrt(board.length);

  const rowStart = row - Math.trunc(row % subgridSize);
  const colStart = col - Math.trunc(col % subgridSize);

  for (let i = 0; i < subgridSize; i++) {
    for (let j = 0; j < subgridSize; j++) {
      if (board[rowStart + i][colStart + j] === num) return false;
    }
  }

  return true;
};
