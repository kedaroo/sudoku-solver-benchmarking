/**
 * Check if the board satifies all the sudoku rules 
 */
export const isValidSudoku = (board: number[][]): boolean => {
  const size = board.length

  // Check rows
  for (let i = 0; i < size; i++) {
    const rowSet = new Set<number>();
    for (let j = 0; j < size; j++) {
      const num = board[i][j];
      if (num !== 0) {
        if (rowSet.has(num)) return false;
        rowSet.add(num);
      }
    }
  }

  // Check columns
  for (let j = 0; j < size; j++) {
    const colSet = new Set<number>();
    for (let i = 0; i < size; i++) {
      const num = board[i][j];
      if (num !== 0) {
        if (colSet.has(num)) return false;
        colSet.add(num);
      }
    }
  }

  // Check 3x3 subgrids
  const subgridSize = Math.sqrt(size)
  const checkSubgrid = (rowStart: number, colStart: number): boolean => {
    const subgridSet = new Set<number>();
    for (let i = rowStart; i < rowStart + subgridSize; i++) {
      for (let j = colStart; j < colStart + subgridSize; j++) {
        const num = board[i][j];
        if (num !== 0) {
          if (subgridSet.has(num)) return false;
          subgridSet.add(num);
        }
      }
    }
    return true;
  };

  // Loop over each 3x3 subgrid
  for (let row = 0; row < size; row += subgridSize) {
    for (let col = 0; col < size; col += subgridSize) {
      if (!checkSubgrid(row, col)) return false;
    }
  }

  return true;
};
