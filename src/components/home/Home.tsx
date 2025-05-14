import React from "react";
import { HowToPlay } from "./HowToPlay";

interface HomeProps {
    onStartGame: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartGame }) => {

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    {Array.from({ length: 20 }, (_, i) => (
                       <div
                         key={i}
                         className="absolute rounded-full bg-white float"
                         style={{
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5,
                            transform: `scale(${Math.random() * 0.5 + 0.5})`,
                         }}
                       >
                       </div> 
                    ))}
                </div>
            </div>

            {/* Title */}
            <div className="relative z-10 w-full max-w-4xl">
                <h1 className="text-6xl font-extrabold text-center mb-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300">
                        MemoMath
                    </span>
                </h1>
                {/* Menu */}
                <HowToPlay onStartGame={onStartGame}/>
            </div>
        </div>
    )
}

