import { createContext } from "react";
import { GameConfig } from "../utils/gameConfig"; // Adjust import path as needed

export interface GameContextType {
    level: keyof typeof GameConfig['presets'];
    setDifficulty: (level: keyof typeof GameConfig['presets']) => void;
    targetNumber: number;
    score: number;
    setScore: (score: number) => void;
    startNewGame: () => void;
}

export const defaultGameContext: GameContextType = {
    level: 'easy',
    setDifficulty: () => {},
    targetNumber: 0,
    score: 0,
    setScore: () => {},
    startNewGame: () => {},
};

export const GameContext = createContext<GameContextType>(defaultGameContext);
