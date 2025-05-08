import { useState, useEffect, useRef, useCallback } from "react";
import { HexTile } from "./HexTile";
import { GameConfig } from "../../utils/gameConfig";
import { Hexagon } from '../../types';

const GameBoard:React.FC = () => {
    const level = 'easy';
    const gridSize = GameConfig.presets[level].gridSize;
    const boardRef = useRef<HTMLDivElement>(null);  // Reference to the board container
    const [hexWidth, setHexWidth] = useState<number>(100); // Responsive width for hexagons
    const [hexHeight, setHexHeight] = useState<number>(115);
    const [hexagons, setHexagons] = useState<Hexagon[]>([]);
    const [revealed, setRevealed] = useState<boolean>(true);
    const [dynamicBorderWidth, setDynamicBorderWidth] = useState<number>(GameConfig.presets[level].borderWidth.medium); // Initialize with a default
    const [dynamicSpacingMultiplier, setDynamicSpacingMultiplier] = useState<number>(GameConfig.presets[level].spacingMultiplier.medium); // Initialize with a default
    // const borderWidth = 3;
    const minimumHexWidth = GameConfig.presets[level].minHexWidth;
    const [boardWidthPx, setBoardWidthPx] = useState<number>(0);
    const [boardHeightPx, setBoardHeightPx] = useState<number>(0);
    const [screenSizeCategory, setScreenSizeCategory] = useState<'small' | 'medium' | 'large'>('medium'); // Default

    // Define your screen size breakpoints
    const smallBreakpoint = 600;
    const mediumBreakpoint = 1024;

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
            const availableVerticalSpace = boardHeight * 0.9;

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
    const generateRandomNumber = () => {
        const range = GameConfig.presets[level].numberRange;
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    };

    const generateHexagons = useCallback(() => {
        const preset = GameConfig.presets[level];
        const hexesPerRow = preset.hexesPerRow;
        const maxHexesInRow = Math.max(...hexesPerRow);

        const hexagonsArray: Hexagon[] = [];
        let hexCount = 0;

        for(let row = 0; row < hexesPerRow.length; row++) {
            const hexInRow = hexesPerRow[row];

            // Center the row: Calculate the horizontal offset
            const totalWidth = hexInRow  * hexWidth;
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
    }, [hexWidth, dynamicBorderWidth, dynamicSpacingMultiplier, level, revealed]);

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
                maxX = Math.max(maxX, hex.x + hexWidth); //Assuming width is the visual width
                minY = Math.min(minY, hex.y);
                maxY = Math.max(maxY, hex.y + hexHeight * 0.7); //Approximate visual height
            });

            setBoardWidthPx(maxX - minX);
            setBoardHeightPx(maxY - minY);
        }


    }, [generateHexagons, hexWidth, hexHeight]);


    return (
        <div className="game-container">
            <div className="board-wrapper">
                <div 
                    className="honeycomb-board" 
                    ref={boardRef}
                    style={{ 
                        transform: `translate(${boardWidthPx ? (window.innerWidth - boardWidthPx) / 2 : 0}px, ${boardHeightPx ? (window.innerHeight - boardHeightPx) / 2 : 0}px)`,
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
        </div>
    )
}


export default GameBoard;
