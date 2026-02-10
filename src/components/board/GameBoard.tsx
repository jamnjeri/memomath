import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { HexTile } from "./HexTile";
import { GameConfig } from "../../utils/gameConfig";
import { Hexagon } from '../../types';
import Progress from "../ui/Progress";
import { motion, AnimatePresence } from "framer-motion";
import { GamePanel } from "./GamePanel";
import HelpModal from "../ui/HelpModal";
import { calculateSum, generateSolvableTarget, getHexCoordinates } from "../../engines/BordEngine";
import { useGame } from "../../hooks/useGame";

type DifficultyLevel = keyof typeof GameConfig['presets'];

interface GameBoardProps {
    level: DifficultyLevel;
}

// 1. New Interface to store persistent data (stops numbers changing on resize)
interface TileData {
    id: number;
    q: number; r: number; s: number;
    letter: string;
    number: number; 
    cleared: boolean;
}

const GameBoard:React.FC<GameBoardProps> = ({ level }) => {
    const boardRef = useRef<HTMLDivElement>(null);  // Reference to the board container
    const [hexWidth, setHexWidth] = useState<number>(100); // Responsive width for hexagons
    const [hexHeight, setHexHeight] = useState<number>(115);
    const [hexagons, setHexagons] = useState<Hexagon[]>([]);
    const [revealed, setRevealed] = useState<boolean>(false);

    // Peek State
    const [isPeeking,setIsPeeking] = useState<boolean>(false);

    // Config & Layout
    const [dynamicBorderWidth, setDynamicBorderWidth] = useState<number>(GameConfig.presets[level].borderWidth.medium); // Initialize with a default
    const [dynamicSpacingMultiplier, setDynamicSpacingMultiplier] = useState<number>(GameConfig.presets[level].spacingMultiplier.medium); // Initialize with a default
    const minimumHexWidth = GameConfig.presets[level].minHexWidth;
    const [boardWidthPx, setBoardWidthPx] = useState<number>(0);
    const [boardHeightPx, setBoardHeightPx] = useState<number>(0);
    const [screenSizeCategory, setScreenSizeCategory] = useState<'small' | 'medium' | 'large'>('medium'); // Default

    // Game Flow
    const revealTime = GameConfig.presets[level].revealTime;
    const [countDown, setCountDown] = useState<number>(revealTime);
    const [countdownActive, setCountdownActive] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(100);
    const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
    const { setScore, score } = useGame();

    const [localTarget, setLocalTarget] = useState(0);
    const [selectedHexes, setSelectedHexes] = useState<Hexagon[]>([]);

    // Visual Feedback States
    const [successFlash, setSuccessFlash] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // 2. State for Persistent Data
    const [tileData, setTileData] = useState<TileData[]>([]);

    // 3. State to force regeneration (New Game)
    const [gameId, setGameId] = useState(0);

    // Define your screen size breakpoints
    const smallBreakpoint = 600;
    const mediumBreakpoint = 1025;


    // ------ Helpers ------

    // Update screen size category based on window width (dynamic border width & spacing multiplier)
    const updateScreenSizeCategory = useCallback(() => {
        const width = window.innerWidth;
        if (width < smallBreakpoint) {
            setScreenSizeCategory('small');
        } else if (width < mediumBreakpoint) {
            setScreenSizeCategory('medium');
        } else {
            setScreenSizeCategory('large');
        }
    }, []);

    // Generate random bubbles
    const bubbles = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => {
            return {
                key: i,
                style: {
                    width: `${Math.random() * 300 + 50}px`,
                    height: `${Math.random() * 300 + 50}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                }
            };
        });
    }, []);

    const handlePeek = () => {
        if (isPeeking || countdownActive || gameOver) return;
        
        setIsPeeking(true);
        setRevealed(true); // Forces layout to show numbers
        
        setTimeout(() => {
            setRevealed(false); // Hides them again
            setIsPeeking(false);
        }, 2000); // 2 seconds peek duration
    };

    // Track countdown and progress bar
    useEffect(() => {
        if(!countdownActive) return;

        const totalDuration = revealTime * 1000;
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(totalDuration - elapsedTime, 0);

            setProgress((remainingTime / totalDuration) * 100);
            setCountDown(Math.ceil(remainingTime / 1000));

            if(remainingTime > 0) {
                requestAnimationFrame(updateProgress);
            } else {
                setCountdownActive(false);
                setRevealed(false);
                setCountDown(0);
            }
        };

        requestAnimationFrame(updateProgress);

        return () => {
            // Cleanup if necessary
            setCountdownActive(false);
        };
    }, [countdownActive, revealTime]);

    useEffect(() => {
        setCountdownActive(true);
        setRevealed(true);
    }, []);

    // Track screen size changes
    useEffect(() => {
        updateScreenSizeCategory();
        window.addEventListener('resize', updateScreenSizeCategory);

        return () => {
            window.removeEventListener('resize', updateScreenSizeCategory);
        };
    }, [updateScreenSizeCategory]);

    // Adjust/ update layout based on screen size and level
    useEffect(() => {
        setDynamicBorderWidth(GameConfig.presets[level].borderWidth[screenSizeCategory] || GameConfig.presets[level].borderWidth.medium); // Fallback to medium
        setDynamicSpacingMultiplier(GameConfig.presets[level].spacingMultiplier[screenSizeCategory] || GameConfig.presets[level].spacingMultiplier.medium); // Fallback to medium
    }, [level, screenSizeCategory]);
    
    // Calculates the hexagon width and height
    const updateHexSize = useCallback(() => {
        const boardWidth = window.innerWidth;
        const boardHeight = window.innerHeight;

        let newHexWidth: number;
        let newHexHeight: number;


        // Default width-based sizing
        newHexWidth = Math.floor(boardWidth / 10);  // Divides the screen into 10 roughly equal horizontal segments
        newHexWidth = Math.max(newHexWidth, minimumHexWidth);   // Ensure the hexagons don't get too small 
        newHexHeight = Math.floor(newHexWidth * (115 / 100));    // Pointy-Topped Hexagons tend to be taller than they are wide 15%

        if(boardHeight < boardWidth) {
            const numRows = GameConfig.presets[level].hexesPerRow.length;
            const availableVerticalSpace = boardHeight * 0.75;           // % of screen height you want the board height to occupy

            // Hex rows not perfectly stacked ontop of each other hence the 0.75
            const estimatedTotalVerticalSpan = numRows * 0.75 * newHexHeight + (numRows - 1) * dynamicBorderWidth;

            if (estimatedTotalVerticalSpan > availableVerticalSpace && numRows > 0) {
                newHexHeight = Math.floor((availableVerticalSpace - (numRows - 1) * dynamicBorderWidth) / (numRows * 0.75));    // (Available space - Total border space ) / (number of rows - 0.75 cause they are not perfectly stacked)
                newHexWidth = Math.floor(newHexHeight * (100 / 115));

                const maxWidthBasedOnHeight = Math.floor(boardWidth / 6);    // Safety measure for tall and narrow viewports: Limit newHexWidth to a reasonable fraction of the boardWidth

                newHexWidth = Math.min(newHexWidth, maxWidthBasedOnHeight);
                newHexWidth = Math.max(newHexWidth, minimumHexWidth);
            }
        }

        setHexWidth(newHexWidth);
        setHexHeight(newHexHeight);
    }, [minimumHexWidth, level, dynamicBorderWidth]);

    const generateSequentialLetter = (index: number) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Alphabet characters
        const base = letters.length; // Length of the alphabet (26 letters)
        let result = '';
      
        // Generate a "base-26" style sequence
        while (index >= 0) {
          result = letters.charAt(index % base) + result; // Get the letter at the current position
          index = Math.floor(index / base) - 1; // Move to the next "digit" in the base-26 system
        }
      
        return result;
    };

    // Generate random number based on difficulty range
    const generateRandomNumber = useCallback(() => {
        const range = GameConfig.presets[level].numberRange;
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }, [level]);

    // JOB A: GENERATE DATA (Numbers & Coordinates) 
    // Run once when game starts. Establishes who is neighbor to whom using qOffset.
    useEffect(() => {
        const preset = GameConfig.presets[level];
        const hexesPerRow = preset.hexesPerRow;
        const maxHexesInRow = Math.max(...hexesPerRow);

        const newTileData: TileData[] = [];
        let hexCount = 0;

        for(let row = 0; row < hexesPerRow.length; row++) {
            const hexInRow = hexesPerRow[row];

            // Align 'q' coordinate offset (math trick for centering)
            // MOVED HERE: Logic belongs to the Data Phase
            const qOffset = Math.floor((maxHexesInRow - hexInRow) / 2);

            for(let col = 0; col < hexInRow; col++) {
                // Calculate Grid Coordinates
                const { q, r, s } = getHexCoordinates(row, col, qOffset);

                newTileData.push({
                    id: hexCount,
                    q,r,s,
                    letter: generateSequentialLetter(hexCount),
                    number: generateRandomNumber(),
                    cleared: false
                });
                hexCount++;
            }
        }
        setTileData(newTileData);

        // Generate Target immediately here to prevent infinite loop
        // Uses the walker function to guarantee solvability
        const initialTarget = generateSolvableTarget(newTileData, 2, 4);
        setLocalTarget(initialTarget);

        // Reset UI State
        setCountdownActive(true);
        setRevealed(true);
        setCountDown(revealTime);
        setSelectedHexes([]);
        setScore(0);
        setGameOver(false);

    }, [level, gameId]); // Only dependent on level and Game Reset

    // JOB B: CALCULATE LAYOUT (Pixels X/Y)
    // Run on resize. Reads numbers from tileData.
    const generateHexagons = useCallback(() => {
        // Safety check: wait for data to exist
        if (tileData.length === 0) return [];

        const preset = GameConfig.presets[level];
        const hexesPerRow = preset.hexesPerRow;
        const maxHexesInRow = Math.max(...hexesPerRow);

        const hexagonsArray: Hexagon[] = [];
        let hexIndex = 0;

        for(let row = 0; row < hexesPerRow.length; row++) {
            const hexInRow = hexesPerRow[row];

            // Center the row: Calculate the horizontal offset
            // KEPT HERE: Pixel calculations belong to the Layout Phase
            const totalWidth = hexInRow  * hexWidth ;
            const maxTotalWidth = maxHexesInRow * hexWidth;
            const rowOffset = (maxTotalWidth - totalWidth) / 2;

            for(let col = 0; col < hexInRow; col++) {
                const x = col * (hexWidth - dynamicBorderWidth ) + rowOffset;
                const y = row * (hexWidth + dynamicBorderWidth) * dynamicSpacingMultiplier;

                // FIX: Instead of generating new randoms, we grab them from memory (tileData)
                if (tileData[hexIndex]) {
                    const data = tileData[hexIndex];
                    hexagonsArray.push({
                        // Visual Props (Recalculated)
                        x, y,
                        revealed: revealed || data.cleared,
                        selected: false,

                        // Data Props (From Memory)
                        id: data.id,
                        q: data.q, // We read 'q' from data, so we don't need qOffset here!
                        r: data.r,
                        s: data.s,
                        letter: data.letter,
                        number: data.number,
                        cleared: data.cleared
                    });
                }
                hexIndex++;
            }
        }

        return hexagonsArray;
    }, [hexWidth, dynamicBorderWidth, dynamicSpacingMultiplier, level, revealed, tileData]);

    // Call the updateHexSize function on window resize
    useEffect(() => {
        const handleResize = () => {
            requestAnimationFrame(() => {
                updateHexSize();
            });
        };
    
        handleResize(); // initial
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
    }, [updateHexSize]);

    const handleNewGame = () => {
        setGameId(prev => prev + 1); // Triggers Job A
        // setScore(0);
        // setCountdownActive(true);
        // setRevealed(true);
        // setCountDown(revealTime);
        // setSelectedHexes([]);
    };

    // Update visuals when layout changes
    useEffect(() => {
        const hexagonsData = generateHexagons();
        setHexagons(hexagonsData);

        // NOTE: Target generation removed from here to fix infinite loop

        // Calculate board dimensions after hexagons are generated
        if(hexagonsData.length > 0) {
            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;

            hexagonsData.forEach((hex) => {
                minX = Math.min(minX, hex.x);
                maxX = Math.max(maxX, hex.x + hexWidth); // Assuming width is the visual width
                minY = Math.min(minY, hex.y);
                maxY = Math.max(maxY, hex.y + hexHeight * 0.7); //Approximate visual height
            });

            setBoardWidthPx(maxX - minX);
            setBoardHeightPx(maxY - minY);
        }
    }, [generateHexagons, hexWidth, hexHeight]);

    const handleTileClick = (clickedHex: Hexagon) => {
        // LOG 1: Did the click actually register?
        console.log("🖱️ CLICKED:", clickedHex.id, "Coords:", clickedHex.q, clickedHex.r, clickedHex.s);
        
        // 1. Ignore clicks during reveal phase
        if (countdownActive) {
            console.log("🚫 Ignored: Countdown active");
            return;
        }

        if (gameOver) return;

        if (clickedHex.cleared) return; // Ignore clicks on cleared tiles

        // 2. Check if already selected
        const isAlreadySelected = selectedHexes.find(h => h.id === clickedHex.id);
        
        if (isAlreadySelected) {
            console.log("↺ Undoing/Resetting selection");
            const lastHex = selectedHexes[selectedHexes.length - 1];
            
            if (lastHex.id === clickedHex.id) {
                const newSelection = selectedHexes.slice(0, -1);
                setSelectedHexes(newSelection);
            } else {
                setSelectedHexes([]); 
            }
            return;
        }

        // 3. LOG 2: Check Validation
        // const isValid = isValidSelection(selectedHexes, clickedHex);
        // console.log("❓ Validation Result:", isValid);

        // if (isValid) {
        //     const newSelection = [...selectedHexes, clickedHex];
        //     setSelectedHexes(newSelection);

        //     // CHECK MATH (Removed the "length === targetLength" restriction)
        //     const currentSum = calculateSum(newSelection);
            
        //     if (currentSum === localTarget) {
        //         console.log("🏆 WIN");
        //         setScore(score + 1);
                
        //         // OPTIONAL: Reset Board / Generate New Target?
        //         // For now, just clear selection
        //         setSelectedHexes([]); 
        //     } 
        //     else if (currentSum > localTarget) {
        //         // AUTO-FAIL: If we exceeded the target, it's wrong.
        //         console.log("❌ OVER TARGET");
                
        //         // Floor the score at 0
        //         setScore(Math.max(0, score - 1));
                
        //         setTimeout(() => setSelectedHexes([]), 500);
        //     }
        //     // If currentSum < localTarget, we do nothing. The player can keep adding tiles!
        // } else {
        //     console.log("⛔ Invalid Move: Not a neighbor or not a straight line");
        // }

        // 3. Select (No Neighbor Check!)
        const newSelection = [...selectedHexes, clickedHex];
        setSelectedHexes(newSelection);

        // 4. Check Win
        const currentSum = calculateSum(newSelection);
        
        if (currentSum === localTarget) {
            console.log("🏆 WIN!");

            // 1. TRIGGER FLASH
            setSuccessFlash(true); 
            setTimeout(() => setSuccessFlash(false), 500);

            setScore(score + 10);
            
            // A. Mark tiles as cleared in Data
            const updatedData = tileData.map(t => 
                newSelection.some(s => s.id === t.id) ? { ...t, cleared: true } : t
            );
            setTileData(updatedData); // This triggers a re-render/re-layout
            
            // B. Clear Selection
            setSelectedHexes([]);

            // C. Generate Next Target
            const remainingTiles = updatedData.filter(t => !t.cleared);
            if (remainingTiles.length >= 2) {
                const nextTarget = generateSolvableTarget(remainingTiles, 2, 4);
                setLocalTarget(nextTarget);
            } else {
                console.log("🎉 GAME OVER - ALL CLEARED");
                setLocalTarget(0); // Or handle end game state
                setGameOver(true); // Trigger Game Over Screen
            }
        } 
        else if (currentSum > localTarget) {
            console.log("❌ Over Target");
            setTimeout(() => setSelectedHexes([]), 500);
        }
    };


    return (
        <div className="game-container bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
            {/* Bubbles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    {bubbles.map(bubble => (
                        <div
                            key={bubble.key}
                            className="absolute rounded-full bg-white float"
                            style={bubble.style}
                        />
                    ))}
                </div>
            </div>
            <div className="board-wrapper">
                <div
                    // className={`absolute left-1/2 transform -translate-x-1/2`}
                    style={{
                        display: 'flex', //  Add this line
                        flexDirection: screenSizeCategory === 'small' ? 'column' : 'initial',
                        alignItems: screenSizeCategory === 'small' ? 'center' : 'initial',
                    }}
                >
                    <h1 className="text-6xl font-extrabold text-center mt-4 mb-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] absolute left-1/2 transform -translate-x-1/2">
                        <a href="/" className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300">
                            MemoMath
                        </a>
                    </h1>
                    <div className={`${screenSizeCategory === 'small' ? '' : ''}`}>
                        {countdownActive && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20 flex items-center gap-3 w-48"
                                style={ { marginTop: screenSizeCategory === 'small' ? '4rem' : '0' } }
                            >
                                <div className="flex-1">
                                    <Progress
                                        value={progress}
                                        className="h-2 bg-white/20"
                                        indicatorClassName="bg-gradient-to-r from-cyan-500 to-teal-500"
                                    />
                                </div>
                                <div className="text-white font-medium text-sm w-5 text-center">{countDown}</div>
                            </motion.div>
                        )}
                    </div>
                </div>
                <div className="game-panel">
                    {!countdownActive &&  (
                        <GamePanel 
                            screenSizeCategory={screenSizeCategory}
                            onOpenModal={() => setHelpModalOpen(true)} 
                            score={score}
                            target={localTarget}
                            gameActive={!countdownActive}
                            onNewGame={handleNewGame}
                            successFlash={successFlash}
                            onPeek={handlePeek}
                            isPeeking={isPeeking}
                        />
                    )}
                </div>

                {/* GAME OVER OVERLAY */}
                <AnimatePresence>
                    {gameOver && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                            <div className="bg-white/10 border border-white/30 p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4">
                                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300 mb-4">Level Complete!</h2>
                                <p className="text-white/80 text-lg mb-6">You cleared the board!</p>
                                <div className="text-5xl font-bold text-white mb-8">{score} <span className="text-xl font-normal text-white/50">pts</span></div>
                                <button 
                                    onClick={handleNewGame}
                                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Play Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div 
                    className="honeycomb-board" 
                    ref={boardRef}
                    style={{ 
                        transform: `translate(${boardWidthPx ? (window.innerWidth - boardWidthPx) / 2 : 0}px, ${boardHeightPx ? (window.innerHeight - boardHeightPx) / 1.3 : 0}px)`,
                    }}
                >
                    {hexagons.map((hex) => (
                        <div key={hex.id}
                            style={{
                                opacity: hex.cleared ? 0.4 : 1,
                                filter: hex.cleared ? 'grayscale(100%)' : 'none',
                                pointerEvents: hex.cleared ? 'none' : 'auto',
                                transition: 'all 0.5s ease'
                            }}
                        >
                            <HexTile 
                                x={hex.x} 
                                y={hex.y} 
                                width={hexWidth} 
                                height={hexHeight} 
                                letter={hex.letter} 
                                number={hex.number} 
                                revealed={hex.revealed}
                                borderWidth={dynamicBorderWidth}
                                selected={selectedHexes.some(h => h.id === hex.id)}
                                onClick={() => handleTileClick(hex)}
                            /> 
                        </div>
                    ))}
                </div>
            </div>
            {helpModalOpen && <HelpModal onClose={() => setHelpModalOpen(false)} />}
        </div>
    )
}


export default GameBoard;
