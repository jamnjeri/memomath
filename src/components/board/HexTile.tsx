import React from "react";
import './HexTile.css';

interface HexTileProps {
    x: number;
    y: number;
    width: number;
    height: number;
    letter: string;
    number: number;
    revealed: boolean;
    borderWidth: number;
}

export const HexTile: React.FC<HexTileProps> = ({ x, y, width, height, letter, number, revealed, borderWidth }) => {
    return (
        <div
            className="hex-tile-wrapper"
            style={{
                left: x,
                top: y,
                width: width,
                height: height,
            }}
        >
            <div
                className="hex-tile"
                style={{
                    width: width - borderWidth * 2,
                    height: height - borderWidth * 2,
                    top: borderWidth,
                    left: borderWidth,
                }}
            >
                {revealed ? number : letter}
            </div>
        </div>
    )
}

