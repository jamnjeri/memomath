import React from "react";
import './HexTile.css';
import { HelpCircle, Home, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface GamePanelProps {
    screenSizeCategory: string,
    onOpenModal: () => void
}

export const GamePanel: React.FC<GamePanelProps> = ({ screenSizeCategory, onOpenModal }) => {
    return (
        <div 
            // className="flex justify-between w-full mb-6 gap-4 top-4"
            className="flex flex-col w-full mt-20 top-2 gap-4"
            style={{ position: 'absolute', padding: '1px' }}
        >
            <div className="flex flex-row items-center justify-between w-full max-w-3xl mx-auto">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 mr-2 flex-1 text-left"
                >
                    <span className="text-white/70 font-medium">Score</span>
                    <div className="text-3xl font-bold text-white"></div>
                </motion.div>

                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 ml-2 flex-1 text-right"
                >
                    <span className="text-base text-white/70 font-medium">Target</span>
                    <div className="text-3xl font-bold text-white"></div>
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
                    <button 
                        type="button"
                        className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20"
                    >
                        <Home className="mr-2 h-4 w-4"/>
                        Home
                    </button>
                    <button 
                        type="button"
                        className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20"
                    >
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        New Game
                    </button>
                    <button 
                        type="button"
                        className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20"
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

