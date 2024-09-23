import { isValidSudoku } from './check-validity';
import { solveSudoku } from './sudoku-solver';
import { mean, writeBenchmarkResultsToCSV } from './utils';
import { Board, createSudokuPuzzle } from './create-sudoku-puzzle';
const { Worker } = require('worker_threads');
const path = require('path'); // To get the worker file path

const runSudokuSolverInWorker = (sudokuPuzzle: Board) => {
  return new Promise<{ solvable: string; timeRequired: number }>(
    (resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, './sudoku-worker.js'));

      worker.postMessage(sudokuPuzzle);

      worker.on(
        'message',
        (result: { solvable: string; timeRequired: number }) => {
          worker.terminate();
          resolve(result);
        }
      );

      worker.on('error', reject);

      worker.on('exit', (code: number) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    }
  );
};

const benchmark = async (iterations: number) => {
  const res: Record<number, number[]> = {};

  for (let size = 3; size <= 4; size++) {
    res[size*size] = [];

    for (let i = 0; i < iterations; i++) {
      const sudokuPuzzle = createSudokuPuzzle('hard', size * size);

      if (!isValidSudoku(sudokuPuzzle)) continue;

      const sudokuPromise = runSudokuSolverInWorker(sudokuPuzzle);

      // Timeout fallback
      const sleep = new Promise<{ solvable: boolean; timeRequired: number }>(
        (resolve) => {
          const timeout = 5000;
          setTimeout(() => {
            resolve({ solvable: false, timeRequired: timeout });
          }, timeout);
        }
      );

      const { solvable, timeRequired } = await Promise.race([
        sudokuPromise,
        sleep,
      ]);

      console.log(
        `Board size: ${size * size}, Time Required: ${timeRequired}, Solvable: ${solvable}`
      );

      if (solvable) res[size*size].push(timeRequired);
    }
  }

  // crunch avg
  const crunchedTimes: Record<number, { avg: number; times: number }> = {};

  for (const [key, value] of Object.entries(res)) {
    crunchedTimes[+key] = { avg: mean(value), times: value.length };
  }

  console.table(crunchedTimes);

  writeBenchmarkResultsToCSV(res);

  process.exit()
};

benchmark(10);
