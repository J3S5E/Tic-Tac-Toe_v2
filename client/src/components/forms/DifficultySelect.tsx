import React from "react";

const DifficultySelect = (props: {
    cpuDifficulty: number;
    setCpuDifficulty: (arg0: number) => void;
}) => {
    return (
        <div className="OptionsList">
            <label className="OptionsItem label">CPU Difficulty</label>
            <label className="OptionsItem radio">
                <input
                    type="radio"
                    name="difficulty"
                    value="1"
                    checked={props.cpuDifficulty === 1}
                    onChange={(e) =>
                        props.setCpuDifficulty(parseInt(e.target.value))
                    }
                />
                Easy
            </label>
            <label className="OptionsItem radio">
                <input
                    type="radio"
                    name="difficulty"
                    value="2"
                    checked={props.cpuDifficulty === 2}
                    onChange={(e) =>
                        props.setCpuDifficulty(parseInt(e.target.value))
                    }
                />
                Medium
            </label>
            <label className="OptionsItem radio">
                <input
                    type="radio"
                    name="difficulty"
                    value="3"
                    checked={props.cpuDifficulty === 3}
                    onChange={(e) =>
                        props.setCpuDifficulty(parseInt(e.target.value))
                    }
                />
                Hard
            </label>
        </div>
    );
};

export default DifficultySelect;
