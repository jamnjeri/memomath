export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Scoring {
    correct: number;
    incorrect: number;
}

export interface ScreenSizeConfig {
    small: number;
    medium: number;
    large: number;
}

export interface Preset {
    gridSize: number;
    revealTime: number,
    targetHexCount: number;
    numberRange: [number, number];  // Tuple for a range of numbers
    hexesPerRow: number[]; 
    minHexWidth: number;
    spacingMultiplier: ScreenSizeConfig;
    borderWidth: ScreenSizeConfig;
}

export interface GameConfigType {
    difficulty: Difficulty;  // Only 'easy', 'medium', or 'hard'
    revealDuration: number;  // Time in milliseconds for reveal duration
    scoring: Scoring;  // Scoring rules
    operations: string[];  // Array of operations, e.g., ['sum']
    allowDiagonal: boolean;  // Whether diagonals are allowed in selections
    presets: {
      easy: Preset;
      medium: Preset;
      hard: Preset;
    };
}

export interface Hexagon {
    id: number;
    x: number;
    y: number;
    q: number;
    r: number;
    s: number;
    letter: string;
    number: number;
    revealed: boolean;
    selected?: boolean;
    cleared?: boolean;
}
  