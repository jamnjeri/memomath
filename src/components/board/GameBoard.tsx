import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { HexTile } from "./HexTile";
import { GameConfig } from "../../utils/gameConfig";
import { Hexagon } from '../../types';
import Progress from "../ui/Progress";
import { motion } from "framer-motion";
import { GamePanel } from "./GamePanel";
import HelpModal from "../ui/HelpModal";

type DifficultyLevel = keyof typeof GameConfig['presets'];

interface GameBoardProps {
    level: DifficultyLevel;
}

const GameBoard:React.FC<GameBoardProps> = ({ level }) => {
    const boardRef = useRef<HTMLDivElement>(null);  // Reference to the board container
    const [hexWidth, setHexWidth] = useState<number>(100); // Responsive width for hexagons
    const [hexHeight, setHexHeight] = useState<number>(115);
    const [hexagons, setHexagons] = useState<Hexagon[]>([]);
    const [revealed, setRevealed] = useState<boolean>(false);
    const [dynamicBorderWidth, setDynamicBorderWidth] = useState<number>(GameConfig.presets[level].borderWidth.medium); // Initialize with a default
    const [dynamicSpacingMultiplier, setDynamicSpacingMultiplier] = useState<number>(GameConfig.presets[level].spacingMultiplier.medium); // Initialize with a default
    // const borderWidth = 3;
    const minimumHexWidth = GameConfig.presets[level].minHexWidth;
    const [boardWidthPx, setBoardWidthPx] = useState<number>(0);
    const [boardHeightPx, setBoardHeightPx] = useState<number>(0);
    const [screenSizeCategory, setScreenSizeCategory] = useState<'small' | 'medium' | 'large'>('medium'); // Default
    const revealTime = GameConfig.presets[level].revealTime;
    const [countDown, setCountDown] = useState<number>(revealTime);
    const [countdownActive, setCountdownActive] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(100);
    const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);

    // Define your screen size breakpoints
    const smallBreakpoint = 600;
    const mediumBreakpoint = 1025;

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

    // Track countdown and progress bar
    useEffect(() => {
        if(!countdownActive) return;

        const totalDuration = revealTime * 1000;
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(totalDuration - elapsedTime, 0);
            const progressValue = (remainingTime / totalDuration) * 100;

            setProgress(progressValue);
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
    
    // Calcualtes the hexagon width and height
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

    const generateHexagons = useCallback(() => {
        const preset = GameConfig.presets[level];
        const hexesPerRow = preset.hexesPerRow;
        const maxHexesInRow = Math.max(...hexesPerRow);

        const hexagonsArray: Hexagon[] = [];
        let hexCount = 0;

        for(let row = 0; row < hexesPerRow.length; row++) {
            const hexInRow = hexesPerRow[row];

            // Center the row: Calculate the horizontal offset
            const totalWidth = hexInRow  * hexWidth ;
            const maxTotalWidth = maxHexesInRow * hexWidth;
            const rowOffset = (maxTotalWidth - totalWidth) / 2;

            for(let col = 0; col < hexInRow; col++) {
                const x = col * (hexWidth - dynamicBorderWidth ) + rowOffset;
                const y = row * (hexWidth + dynamicBorderWidth) * dynamicSpacingMultiplier;

                const letter = generateSequentialLetter(hexCount);
                const number = generateRandomNumber();

                hexagonsArray.push({
                    x,
                    y,
                    letter,
                    number,
                    revealed: revealed,
                    id: hexCount,
                });

                hexCount++;
            }
        }

        return hexagonsArray;
    }, [hexWidth, dynamicBorderWidth, dynamicSpacingMultiplier, level, revealed, generateRandomNumber]);

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

    useEffect(() => {
        const hexagonsData = generateHexagons();
        setHexagons(hexagonsData);

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
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300">
                            MemoMath
                        </span>
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
                        />
                    )}
                </div>
                <div 
                    className="honeycomb-board" 
                    ref={boardRef}
                    style={{ 
                        transform: `translate(${boardWidthPx ? (window.innerWidth - boardWidthPx) / 2 : 0}px, ${boardHeightPx ? (window.innerHeight - boardHeightPx) / 1.5 : 0}px)`,
                    }}
                >
                    {hexagons.map((hex) => (
                        <div key={hex.id}>
                            <HexTile 
                                x={hex.x} 
                                y={hex.y} 
                                width={hexWidth} 
                                height={hexHeight} 
                                letter={hex.letter} 
                                number={hex.number} 
                                revealed={hex.revealed}
                                borderWidth={dynamicBorderWidth} 
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
