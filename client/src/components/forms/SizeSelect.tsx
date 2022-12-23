import React from "react";

const SizeSelect = (props: {
    size: number;
    minBoardSize: number;
    maxBoardSize: number;
    changeGrid: (arg0: string) => void;
}) => {
    return (
        <div className="OptionsItems">
            <label className="OptionsItem label">Board Size</label>
            <label className="OptionsItem slider">
                <input
                    type="range"
                    name="size"
                    value={props.size}
                    min={props.minBoardSize}
                    max={props.maxBoardSize}
                    step={1}
                    onChange={(e) => props.changeGrid(e.target.value)}
                />
            </label>
            <label className="OptionsItem value">{`${props.size} x ${props.size} grid`}</label>
        </div>
    );
};

export default SizeSelect;
