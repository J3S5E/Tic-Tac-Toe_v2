import React from "react";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import useLocalStorage from "../shared/hooks/useLocalStorage";
import DifficultySelect from "./forms/DifficultySelect";
import HandSizeSelect from "./forms/HandSizeSelect";
import NameEnter from "./forms/NameEnter";
import SizeSelect from "./forms/SizeSelect";

const minBoardSize = 2;
const maxBoardSize = 9;

const OptionsSchema = z.object({
    size: z.number().min(minBoardSize).max(maxBoardSize).int(),
    minHandSize: z.number().min(1).int(),
    cpuDifficulty: z.number().min(1).max(3).int().optional(),
    playerName: z.string().min(1).optional(),
});

type OptionsType = z.infer<typeof OptionsSchema>;

type OptionsProps = {
    setOptions: (arg0: OptionsType) => void;
    mode: "cpu" | "local" | "online";
    waiting?: boolean;
};

const Options = (props: OptionsProps) => {
    const [size, setSize] = useLocalStorage("board-size", 3);
    const [minHandSize, setMinHandSize] = useLocalStorage("hand-size", 3);
    const [cpuDifficulty, setCpuDifficulty] = useLocalStorage("difficulty", 1);
    const [playerName, setPlayerName] = useLocalStorage("player-name", "");

    const waiting = props.waiting ?? false;

    const submitHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        let options: OptionsType = {
            size,
            minHandSize,
        };

        switch (props.mode) {
            case "cpu":
                options.cpuDifficulty = cpuDifficulty;
                break;
            case "online":
                options.playerName = playerName;
                break;
        }

        const result = OptionsSchema.safeParse(options);

        if (result.success) {
            props.setOptions(options);
        } else {
            alert(fromZodError(result.error));
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

    function getIcon() {
        switch (props.mode) {
            case "cpu":
                return "🤖";
            case "local":
                return "👥";
            case "online":
                return "🌐";
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="Options text-center">
                {waiting === true ? (
                    <div className="OptionsHeader giant_emoji spinner">{getIcon()}</div>
                ) : (
                    <div className="OptionsHeader giant_emoji">{getIcon()}</div>
                )}
                {props.mode === "online" && (
                    <NameEnter
                        setPlayerName={setPlayerName}
                        playerName={playerName}
                    />
                )}
                <div className="OptionsGrid">
                    <SizeSelect
                        size={size}
                        minBoardSize={minBoardSize}
                        maxBoardSize={maxBoardSize}
                        changeGrid={changeGrid}
                    />
                    <HandSizeSelect
                        size={size}
                        minHandSize={minHandSize}
                        changeHandSize={changeHandSize}
                    />
                </div>
                {props.mode === "cpu" && (
                    <DifficultySelect
                        setCpuDifficulty={setCpuDifficulty}
                        cpuDifficulty={cpuDifficulty}
                    />
                )}
                <div className="MenuItems">
                    <button className="MenuItem btn-success">Start</button>
                </div>
            </div>
        </form>
    );
};

export default Options;
