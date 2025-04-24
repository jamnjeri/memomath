export const GameConfig = {
    difficulty: 'easy', // Default difficulty
    revealDuration: 5000, // 5 seconds for number visibility
    scoring: {
      correct: +1,
      incorrect: -1,
    },
    operations: ['sum'], // Currently, we only have 'sum'
    allowDiagonal: false, // Whether diagonal lines are allowed in selections
    presets: {
      easy: { gridSize: 7, targetHexCount: 2, numberRange: [1, 9] },
      medium: { gridSize: 19, targetHexCount: 3, numberRange: [1, 15] },
      hard: { gridSize: 37, targetHexCount: 4, numberRange: [1, 20] },
    },
};