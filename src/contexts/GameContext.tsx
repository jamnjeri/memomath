import React, { useState, FC, useMemo, useCallback } from "react";
import { GameConfig } from "../utils/gameConfig";
import { GameContext, GameContextType, defaultGameContext } from "./GameContextData";

export const GameProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [level, setLevel] = useState<keyof typeof GameConfig['presets']>(defaultGameContext.level);
    const [targetNumber, setTargetNumber] = useState<number>(defaultGameContext.targetNumber);
    const [score, setScore] = useState<number>(defaultGameContext.score);

    const startNewGame = useCallback(() => {
        // Implement your start new game logic here
        console.log('Starting a new game with level:', level);
        setScore(0);
        setTargetNumber(0); // Reset target number
        // ... other initialization logic
    }, [level, setScore, setTargetNumber]);

    const contextValue: GameContextType = useMemo(() => ({
        level,
        setDifficulty: setLevel,
        targetNumber,
        score,
        setScore,
        startNewGame,
    }), [level, setLevel, targetNumber, score, setScore, startNewGame]);

    return (
        <GameContext value={contextValue}>
            {children}
        </GameContext>
    );
};

