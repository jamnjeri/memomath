import { Hexagon } from "../types";

// 1. Define a minimal interface for coordinates
// This allows areNeighbors to work with ANY object that has q,r,s
interface HexCoordinates {
    q: number;
    r: number;
    s: number;
}

// 2. Define the minimal node for the logic engine
// This matches the data structure used in generateSolvableTarget
export interface HexNode {
    id: number;
    q: number; r: number; s: number;
    number: number;
}

// --- Coordinate Math ---

export const getHexCoordinates = (row: number, col: number, rowOffset: number): { q: number, r: number, s: number } => {
    const r = row;
    // Note: Ensure this rowOffset logic matches your visual layout in GameBoard!
    const q = col - Math.floor(row / 2) - rowOffset;
    const s = -q - r;
    return { q, r, s };
};

// --- Validation Logic ---

// FIX: Updated to accept HexCoordinates (works for both Hexagon and HexNode)
export const areNeighbors = (h1: HexCoordinates, h2: HexCoordinates): boolean => {
    const dq = Math.abs(h1.q - h2.q);
    const dr = Math.abs(h1.r - h2.r);
    const ds = Math.abs(h1.s - h2.s);

    // In a Cube Coordinate system, distance 1 means neighbors
    return (dq + dr + ds) / 2 === 1;
}

// NEW: Relaxed Validation (The "Snake" Rule)
export const isValidSelection = (selectedHexes: Hexagon[], newHex: Hexagon): boolean => {
    // 1. First selection is always valid
    // if (selectedHexes.length === 0) return true;

    // const lastHex = selectedHexes[selectedHexes.length - 1];

    // 2. The new hex MUST be a neighbor of the last selected hex.
    // if (!areNeighbors(lastHex, newHex)) return false;

    // 3. PREVENT BACKTRACKING: Ensure we haven't already selected this hex
    if (selectedHexes.some(h => h.id === newHex.id)) return false;

    return true;
};

// --- Game Logic ---

// Helper to calculate target sum
export const calculateSum = (hexes: Hexagon[]): number => {
    return hexes.reduce((sum, hex) => sum + hex.number, 0);
};

// Generate a valid target number based on the board
// This ensures the game is always solvable!
// export const generateSolvableTarget = (hexagons: HexNode[], minLength: number = 2): number => {
//     // Try 50 times to find a valid path
//     for(let i = 0; i < 50; i++) {
//         const startHex = hexagons[Math.floor(Math.random() * hexagons.length)];
//         let currentHex = startHex;
//         let currentSum = startHex.number;
//         let pathLength = 1;
//         const usedIds = [startHex.id];

//         // Walk a random path of 2 to 4 steps
//         const targetSteps = Math.floor(Math.random() * 3) + minLength; 

//         while(pathLength < targetSteps) {
//             // Find all neighbors of currentHex
//             // This now works because HexNode satisfies HexCoordinates!
//             const neighbors = hexagons.filter(h => 
//                 areNeighbors(h, currentHex) && !usedIds.includes(h.id)
//             );

//             if (neighbors.length === 0) break; // Dead end

//             // Pick random neighbor
//             const nextHex = neighbors[Math.floor(Math.random() * neighbors.length)];
//             currentSum += nextHex.number;
//             usedIds.push(nextHex.id);
//             currentHex = nextHex;
//             pathLength++;
//         }

//         // If we found a decent path, return that sum
//         if(pathLength >= minLength) return currentSum;
//     }
//     return 15; // Fallback
// };

// 3. Target Generator (Guaranteed Solvable)
// It takes the list of *available* tiles and sums 2-4 of them to create a target.
export const generateSolvableTarget = (availableHexes: {number: number}[], minTiles: number = 2, maxTiles: number = 4): number => {
    if (availableHexes.length < minTiles) return 0;

    // Determine chain length (random between min and max)
    // Don't ask for more tiles than we have left!
    const safeMax = Math.min(maxTiles, availableHexes.length);
    const count = Math.floor(Math.random() * (safeMax - minTiles + 1)) + minTiles;
    
    // Shuffle and pick random numbers to sum
    // We clone the array to avoid messing up the original order
    const shuffled = [...availableHexes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    // Return the sum
    return selected.reduce((sum, item) => sum + item.number, 0);
};


