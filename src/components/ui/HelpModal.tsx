import { Brain, Target, Trophy, X, Zap } from "lucide-react";
import React from "react";
import { useGame } from "../../hooks/useGame";
import { GameConfig } from "../../utils/gameConfig";

interface HelpModalProps {
        onClose: () => void;
    }


const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const { level } = useGame();
    const revealTime = GameConfig.presets[level].revealTime; 

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-white/20 text-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <button 
                type="button" 
                onClick={() => onClose()} 
                className="absolute top-2 right-1 text-white hover:text-cyan-300"
            >
                <X className="h-5 w-5"/>
            </button>
            <div className="text-2xl font-bold text-center mt-3">How to Play MemoMath</div>
            <div className="space-y-4 mt-4">
                <div className="flex items-start">
                    <Brain className="mr-3 h-6 w-6 text-cyan-300 flex-shrink-0 mt-1" />
                    <p>Numbers are shown for a few seconds at the start, then flipped to show letters.</p>
                </div>
                <div className="flex items-start">
                    <Target className="mr-3 h-6 w-6 text-teal-300 flex-shrink-0 mt-1" />
                    <p>Select adjacent hexes in a straight line that add up to the target number.</p>
                </div>
                <div className="flex items-start">
                    <Trophy className="mr-3 h-6 w-6 text-emerald-300 flex-shrink-0 mt-1" />
                    <p>Correct guess: +1 point, Incorrect: -1 point. Try to reveal all tiles!</p>
                </div>
                <div className="flex items-start">
                    <Zap className="mr-3 h-6 w-6 text-emerald-300 flex-shrink-0 mt-1" />
                    <p>
                        <strong>Current Difficulty:</strong>{""}
                        <span className="text-sm opacity-80">
                            {level === "easy" && `Fewer hexagons, ${revealTime} seconds reveal time`}
                            {level === "medium" && `Standard grid size, ${revealTime} seconds reveal time`}
                            {level === "hard" && `More hexagons, ${revealTime} seconds reveal time`}
                        </span>
                    </p>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <button
                    type="button"
                    className="flex flex-row items-center mt-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 rounded-xl"
                    onClick={() => onClose()}
                >
                    <X className="mr-2 h-4 w-4" />
                    Close
                </button>
            </div>
        </div>
      </div>
    );
  };
  
export default HelpModal;
