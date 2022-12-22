import React, { useState } from "react";

const Options = (props) => {
    const [size, setSize] = useState("3");
    const [minHandSize, setMinHandSize] = useState("3");

    const submitHandler = (e) => {
        e.preventDefault();

        // TODO: zod validation

        props.setOptions({
            size: size,
            minHandSize: minHandSize,
        });
    };

    function changeGrid(value) {
        setSize(value);
        if (minHandSize > value * 2) {
            setMinHandSize(value * 2);
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="Options text-center">
                <div className="OptionsHeader giant_emoji">⚙️</div>
                <div className="OptionsMenu">
                    <div className="OptionsItems">
                        <label className="OptionsItem label">Board Size</label>
                        <label className="OptionsItem slider">
                            <input
                                type="range"
                                name="size"
                                value={size}
                                min="2"
                                max="9"
                                step={1}
                                onChange={(e) => changeGrid(e.target.value)}
                            />
                        </label>
                        <label className="OptionsItem value">{`${size} x ${size} grid`}</label>
                    </div>
                    <div className="OptionsItems">
                        <label className="OptionsItem label">
                            Minimum Hand Size
                        </label>
                        <label className="OptionsItem Number">
                            <input
                                type="range"
                                name="minHandSize"
                                value={minHandSize}
                                min="1"
                                max={size * 2}
                                step={1}
                                onChange={(e) => setMinHandSize(e.target.value)}
                            />
                        </label>
                        <label className="OptionsItem value">{`${minHandSize} cards`}</label>
                    </div>
                </div>
                <div className="MenuItems">
                    <button className="MenuItem btn-success">Start</button>
                </div>
            </div>
        </form>
    );
};

export default Options;
