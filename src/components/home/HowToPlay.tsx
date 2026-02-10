import React from "react";
import { motion } from "framer-motion";
import { Brain, Target, Trophy, Zap } from "lucide-react";
import { GameConfig } from "../../utils/gameConfig";
import { useGame } from "../../hooks/useGame";

interface HowToPlayProps {
    onStartGame: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onStartGame }) => {
    const { level, setDifficulty } = useGame();
    const revealTime = GameConfig.presets[level].revealTime; 

    const handleDifficultyChange = (newLevel: keyof typeof GameConfig['presets']) => {
        setDifficulty(newLevel);
        console.log('Difficulty set to:', newLevel);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20"
            >
                <h2 className="text-3xl font-bold mb-6 text-white">How to Play</h2>
                <ul className="text-left space-y-4 mb-6 text-white/90">
                    <li className="flex items-center">
                        <div className="bg-cyan-500/20 p-2 rounded-lg mr-4">
                            <Brain className="h-6 w-6 text-cyan-300" />
                        </div>
                        <div>
                            <span className="block font-bold text-lg">Memorize</span>
                            <span className="text-white/60 text-sm">Numbers show for {revealTime}s, then flip over.</span>
                        </div>
                    </li>
                    <li className="flex items-center">
                        <div className="bg-teal-500/20 p-2 rounded-lg mr-4">
                            <Target className="h-6 w-6 text-teal-300" />
                        </div>
                        <div>
                            <span className="block font-bold text-lg">Calculate</span>
                            <span className="text-white/60 text-sm">Pick any tiles that sum to the Target.</span>
                        </div>
                    </li>
                    <li className="flex items-center">
                        <div className="bg-emerald-500/20 p-2 rounded-lg mr-4">
                            <Trophy className="h-6 w-6 text-emerald-300" />
                        </div>
                        <div>
                            <span className="block font-bold text-lg">Clear the Board</span>
                            <span className="text-white/60 text-sm">Correct matches vanish. Clear all to win!</span>
                        </div>
                    </li>
                </ul>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-center">
                        <Zap className="mr-2 h-5 w-5 text-emerald-300"/>
                        Difficulty Level
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {Object.keys(GameConfig.presets).map((key) => (
                            <button
                                key={key}
                                type="button"
                                className={`
                                    px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300
                                    ${level === key 
                                        ? (key === "easy" 
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105 shadow-lg"
                                            : key === "medium" 
                                                ? "bg-gradient-to-r from-cyan-500 to-teal-600 text-white scale-105 shadow-lg"
                                                : key === "hard" 
                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-105 shadow-lg"
                                                    : "")
                                        : "bg-white/10 text-white hover:bg-white/20"
                                    }
                                `}
                                onClick={() => handleDifficultyChange(key as keyof typeof GameConfig['presets'])}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 
                        text-white px-10 py-6 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={onStartGame}
                >
                    START GAME
                </button>
                <div className="mt-4 text-white/70 text-sm">
                    {level === "easy" && <p>Fewer hexagons, longer reveal time ({revealTime} seconds)</p>}
                    {level === "medium" && <p>Standard grid size, {revealTime} seconds reveal time</p>}
                    {level === "hard" && <p>More hexagons, shorter reveal time ({revealTime} seconds)</p>}
                </div>

            </motion.div>
        </div>
    )
}

