import { GameConfigType } from '../types';

export const GameConfig: GameConfigType = {
    difficulty: 'easy', // Default difficulty
    revealDuration: 5000, // 5 seconds for number visibility
    scoring: {
      correct: +1,
      incorrect: -1,
    },
    operations: ['sum'], // Currently, we only have 'sum'
    allowDiagonal: false, // Whether diagonal lines are allowed in selections
    presets: {
      easy: { 
        gridSize: 7,
        revealTime: 10, 
        targetHexCount: 2, 
        numberRange: [1, 9], 
        hexesPerRow: [2, 3, 2], 
        minHexWidth: 110,
        spacingMultiplier: {
          small: 0.83,
          medium: 0.81,
          large: 0.82,
        },
        borderWidth: {
          small: 2,
          medium: 3,
          large: 4,
        }
      },
      medium: { 
        gridSize: 19, 
        revealTime: 8,
        targetHexCount: 3, 
        numberRange: [1, 15], 
        hexesPerRow: [3, 4, 5, 4, 3], 
        minHexWidth: 76,
        spacingMultiplier: {
          small: 0.82,
          medium: 0.78,
          large: 0.82,
        },
        borderWidth: {
          small: 2,
          medium: 3,
          large: 4,
        }
      },
      hard: { 
        gridSize: 37, 
        revealTime: 50,
        targetHexCount: 4, 
        numberRange: [1, 20], 
        hexesPerRow: [4, 5, 6, 7, 6, 5, 4], 
        minHexWidth: 50,
        spacingMultiplier: {
          small: 0.8,
          medium: 0.79,
          large: 0.82,
        },
        borderWidth: {
          small: 2,
          medium: 3,
          large: 4,
        }
      },
    },
};