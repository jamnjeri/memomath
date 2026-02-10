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
    selected?: boolean;
    onClick: () => void;
}

export const HexTile: React.FC<HexTileProps> = ({ x, y, width, height, letter, number, revealed, borderWidth, selected, onClick }) => {
    return (
        <div
            className="hex-tile-wrapper"
            style={{
                left: x,
                top: y,
                width: width,
                height: height,
                cursor: 'pointer',
                zIndex: selected ? 10 : 1
            }}
            onClick={onClick}
        >
            <div
                className="hex-tile"
                style={{
                    width: width - borderWidth * 2,
                    height: height - borderWidth * 2,
                    top: borderWidth,
                    left: borderWidth,
                    backgroundColor: selected ? '#000' : '',
                    color: revealed ? '#000' : (selected ? '#fff' : '#000')
                }}
            >
                {revealed ? number : letter}
            </div>
        </div>
    )
}

