import { Brain, Target, Trophy, X, Eye } from "lucide-react";
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
                    <p><span className="font-bold text-cyan-100">Memorize:</span> Numbers flash for {revealTime} seconds at the start. Lock them in your memory!</p>
                </div>
                <div className="flex items-start">
                    <Target className="mr-3 h-6 w-6 text-teal-300 flex-shrink-0 mt-1" />
                    <p><span className="font-bold text-teal-100">Match:</span> Select <strong>any</strong> combination of tiles that add up to the Target number.</p>
                </div>
                <div className="flex items-start">
                    <Trophy className="mr-3 h-6 w-6 text-emerald-300 flex-shrink-0 mt-1" />
                    <p><span className="font-bold text-emerald-100">Score:</span> Correct sum = <strong>+10 points</strong>. The tiles clear, and a NEW target appears immediately.</p>
                </div>
                <div className="flex items-start">
                    <Eye className="mr-3 h-5 w-5 text-purple-300 flex-shrink-0 mt-1" />
                    <p><span className="font-bold text-purple-100">Stuck?</span> Use the <strong>Peek</strong> button to briefly reveal the board if you forget the numbers.</p>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <button
                    type="button"
                    className="flex flex-row items-center mt-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 rounded-xl"
                    onClick={() => onClose()}
                >
                    <X className="mr-2 h-4 w-4" />
                    Got it !
                </button>
            </div>
        </div>
      </div>
    );
  };
  
export default HelpModal;
