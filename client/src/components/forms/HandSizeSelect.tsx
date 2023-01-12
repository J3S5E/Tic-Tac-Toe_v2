import React from "react";

const HandSizeSelect = (props: {
    size: number;
    minHandSize: number;
    changeHandSize: (arg0: string) => void;
}) => {
    return (
        <div className="OptionsItems">
            <label className="OptionsItem label">Minimum Hand Size</label>
            <input
                type="range"
                name="minHandSize"
                value={props.minHandSize}
                min="1"
                max={props.size * 2}
                step={1}
                onChange={(e) => props.changeHandSize(e.target.value)}
            />
            <label className="OptionsItem value">{`${props.minHandSize} cards`}</label>
        </div>
    );
};

export default HandSizeSelect;
