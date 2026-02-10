import React from "react";
import './HexTile.css';
import { HelpCircle, Home, RefreshCw, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface GamePanelProps {
    screenSizeCategory: string;
    onOpenModal: () => void;
    score: number;
    target: number;
    gameActive: boolean;
    onNewGame: () => void;
    successFlash?: boolean; 
    onPeek?:() => void; 
    isPeeking?: boolean;
}

export const GamePanel: React.FC<GamePanelProps> = ({ screenSizeCategory, onOpenModal, score, target, gameActive, onNewGame, successFlash, onPeek, isPeeking }) => {
    return (
        <div 
            // className="flex justify-between w-full mb-6 gap-4 top-4"
            className="flex flex-col w-full mt-20 top-0 gap-4"
            style={{ position: 'absolute', padding: '10px' }}
        >
            <div className="flex flex-row items-center justify-between w-full max-w-3xl mx-auto">
                {/* SCORE CARD */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ 
                        x: 0, 
                        opacity: 1,
                        scale: successFlash ? 1.1 : 1,
                        borderColor: successFlash ? "rgba(110, 231, 183, 0.9)" : "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 mr-2 flex-1 text-left transition-colors duration-300"
                >
                    <span className="text-white/70 font-medium">Score</span>
                    <div className="text-3xl font-bold text-white">{score}</div>
                </motion.div>

                {/* TARGET CARD */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ 
                        x: 0, 
                        opacity: 1,
                        scale: successFlash ? 1.1 : 1,
                        borderColor: successFlash ? "rgba(110, 231, 183, 0.9)" : "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 ml-2 flex-1 text-right transition-colors duration-300"
                >
                    <span className="text-base text-white/70 font-medium">Target</span>
                    <div className="text-3xl font-bold text-white">
                        {/* {gameActive ? target : "?"} */}
                        {gameActive && target > 0 ? target : target === 0 ? "DONE" : "?"}
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-row items-center w-full max-w-3xl mx-auto">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={
                        screenSizeCategory === 'large'
                          ? "flex flex-col gap-3 mb-6 ml-4"
                          : "w-full flex justify-center gap-3 mb-6"
                    }
                    style={screenSizeCategory === 'large' ? { position: 'absolute', left: '2rem', top: '7rem' } : {}}
                >
                    {screenSizeCategory !== 'small' && (
                        <button 
                            type="button"
                            className="flex items-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
                            onClick={() => window.location.reload()}
                        >
                            <Home className="mr-2 h-4 w-4"/>
                            Home
                        </button>
                    )}
                    <button 
                        type="button"
                        onClick={onPeek}
                        disabled={isPeeking || !gameActive}
                        className={`flex items-center p-3 rounded-xl border border-white/20 text-white transition-all
                            ${isPeeking 
                                ? "bg-cyan-500/80 text-white cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.6)] border-cyan-300" 
                                : "bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 hover:shadow-lg hover:border-white"
                            }
                        `}
                    >
                        <Eye className="mr-2 h-4 w-4"/>
                        {isPeeking ? "Peeking..." : "Peek"}
                    </button>
                    <button 
                        type="button"
                        className="flex items-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
                        onClick={onNewGame}
                    >
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        New Game
                    </button>
                    <button 
                        type="button"
                        className="flex items-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
                        onClick={() => onOpenModal()}
                    >
                        <HelpCircle className="mr-2 h-4 w-4"/>
                        Help
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

