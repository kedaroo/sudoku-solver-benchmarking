import { DifficultyLevel } from './create-sudoku-puzzle';
import fs from 'fs';

/**
 * Returns an object with sudoku number from 1-9.
 * @returns an object { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9 }
 */
export const generateTokens = (size: number) => {
  const tokens: Record<number, number> = {};

  for (let i = 1; i < size + 1; i++) tokens[i] = i;

  return tokens;
};

/**
 *
 * @returns a bucket for every number from 1-9.
 * E.g., {1: { 1:1, 2:2, 3:3, ...}, 2: { 1:1, 2:2, 3:3, ...}, ...}
 */
export const generateTokenBuckets = (size: number) => {
  const bucket: Record<number, Record<number, number>> = {};

  for (let i = 0; i < size; i++) bucket[i] = generateTokens(size);

  return bucket;
};

/**
 *
 * @returns a bucket for subgrid such as 00, 01, 02, 10, 11, 12...
 * E.g., {00: { 1:1, 2:2, 3:3, ...}, 01: { 1:1, 2:2, 3:3, ...}, ...}
 */
export const generateTokenBucketsForGrids = (size: number) => {
  const subgridSize = Math.sqrt(size);
  const bucket: Record<string, Record<number, number>> = {};

  for (let i = 0; i < subgridSize; i++) {
    for (let j = 0; j < subgridSize; j++) {
      bucket[`${i}${j}`] = generateTokens(size);
    }
  }

  return bucket;
};

export const getSubgridId = (
  row: number,
  col: number,
  size: number
): string => {
  const divisor = Math.sqrt(size);
  return `${Math.trunc(row / divisor)}${Math.trunc(col / divisor)}`;
};

export const getDifficultyValue = (difficultyLevel: DifficultyLevel) => {
  switch (difficultyLevel) {
    case 'easy':
      return 0.4;
    case 'medium':
      return 0.6;
    case 'hard':
      return 0.7;
    default:
      return 0.5;
  }
};

export const mean = (numbers: number[]) => {
  if (numbers.length === 0) return 0;

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
};

export const writeBenchmarkResultsToCSV = (
  results: Record<number, number[]>
): void => {
  const header = 'Board Size,Time Required\n';
  const rows: string[] = [];

  for (const size in results) {
    results[size].forEach((time) => {
      rows.push(`${size},${time}`);
    });
  }

  const csvData = header + rows.join('\n');

  fs.writeFileSync('benchmark_results.csv', csvData);

  console.log('CSV file saved successfully as benchmark_results.csv');
};
