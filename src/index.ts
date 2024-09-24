import { isValidSudoku } from './check-validity';
import { mean, writeBenchmarkResultsToCSV } from './utils';
import { Board, createSudokuPuzzle } from './create-sudoku-puzzle';
const { Worker } = require('worker_threads');
const path = require('path'); // To get the worker file path

const runSudokuSolverInWorker = (sudokuPuzzle: Board) => {
  return new Promise<{ solvable: string; timeRequired: number, invocations: number }>(
    (resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, './sudoku-worker.js'));

      worker.postMessage(sudokuPuzzle);

      worker.on(
        'message',
        (result: { solvable: string; timeRequired: number, invocations: number }) => {
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

  for (let size = 4; size <= 4; size++) {
    res[size*size] = [];

    for (let i = 0; i < iterations; i++) {
      const sudokuPuzzle = createSudokuPuzzle('hard', size * size);

      if (!isValidSudoku(sudokuPuzzle)) continue;

      const sudokuPromise = runSudokuSolverInWorker(sudokuPuzzle);

      // Timeout fallback
      const sleep = new Promise<{ solvable: boolean; timeRequired: number, invocations: number }>(
        (resolve) => {
          const timeout = 10000;
          setTimeout(() => {
            resolve({ solvable: false, timeRequired: timeout, invocations: -1 });
          }, timeout);
        }
      );

      const { solvable, timeRequired, invocations } = await Promise.race([
        sudokuPromise,
        sleep,
      ]);

      console.log(
        `Board size: ${size * size}, Time Required: ${timeRequired}, Solvable: ${solvable}, invocations: ${invocations}`
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

benchmark(20);
