import React, { useState } from "react";
import { z } from "zod";

const minBoardSize = 2;
const maxBoardSize = 9;



const OptionsSchema = z.object({
    size: z.number().min(minBoardSize).max(maxBoardSize).int(),
    minHandSize: z.number().min(1).int(),
});



type OptionsType = z.infer<typeof OptionsSchema>;

type OptionsProps = {
    setOptions: (arg0: OptionsType) => void;
};



const Options = (props: OptionsProps) => {
    const [size, setSize] = useState(3);
    const [minHandSize, setMinHandSize] = useState(3);

    const submitHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!OptionsSchema.safeParse({ size, minHandSize }).success) {
            alert("Invalid options");
        } else {
            props.setOptions({
                size: size,
                minHandSize: minHandSize,
            });
        }
    };

    function changeGrid(value: string) {
        const num = parseInt(value);
        setSize(num);
        if (minHandSize > num * 2) {
            setMinHandSize(num * 2);
        }
    }

    function changeHandSize(value: string) {
        setMinHandSize(parseInt(value));
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
                                min={minBoardSize}
                                max={maxBoardSize}
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
                                onChange={(e) => changeHandSize(e.target.value)}
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
