import {
  generateTokenBucketsForGrids,
  generateTokenBuckets,
  getSubgridId,
  getDifficultyValue,
} from './utils';

export type Board = number[][];
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const createSudokuPuzzle = (difficultyLevel: DifficultyLevel, size: number): Board => {
  const board: Board = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  const numberTokensForSubgrids = generateTokenBucketsForGrids(size);
  const numberTokensForColumns = generateTokenBuckets(size);
  const numberTokensForRows = generateTokenBuckets(size);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const subgridId = getSubgridId(i, j, size);

      let validNumbers = Object.keys(numberTokensForRows[i])
        .map(Number)
        .filter(
          (num) =>
            numberTokensForColumns[j][num] &&
            numberTokensForSubgrids[subgridId][num]
        );

      if (validNumbers.length > 0) {
        // const randomNum = validNumbers.pop()!;
        const randomNum = validNumbers[Math.floor(Math.random() * validNumbers.length)];

        if (Math.random() > getDifficultyValue(difficultyLevel)) {
          board[i][j] = randomNum;

          // Remove this number from the buckets
          delete numberTokensForRows[i][randomNum];
          delete numberTokensForColumns[j][randomNum];
          delete numberTokensForSubgrids[subgridId][randomNum];
        } else {
          board[i][j] = 0;
        }
      } else {
        board[i][j] = 0;
      }
    }
  }

  return board;
};
