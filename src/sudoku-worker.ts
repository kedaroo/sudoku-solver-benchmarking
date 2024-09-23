import { parentPort } from 'worker_threads';
import { solveSudoku } from './sudoku-solver';

if (parentPort) {
    parentPort.on('message', (sudokuPuzzle) => {
      const { solvable, timeRequired } = solveSudoku(sudokuPuzzle);
      parentPort!.postMessage({ solvable, timeRequired });
    });
}
