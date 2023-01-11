import React, { useState, useEffect } from "react";
import GameInstance from "../components/Game";
import Options from "../components/Options";
import { Game, PlayerMove, GameOptions } from "../shared/interfaces/game.interface";
import SetupGame from "../shared/actions/local/setup";
import HandleMove from "../shared/actions/local/move";

function Local() {
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
    const [gameState, setGameState] = useState<Game | null>(null);

    function init(gameOptions: GameOptions) {
        setGameState(SetupGame(gameOptions));
    }

    async function handleMove(move: PlayerMove) {
        if (gameState === null) {
            return;
        }
        setGameState(HandleMove(gameState, move));
    }

    function reset() {
        setGameOptions(null);
        setGameState(null);
    }


    useEffect(() => {
        if (gameOptions !== null)
            init(gameOptions);
    }, [gameOptions]);

    return (
        <>
            {gameState === null || gameOptions === null ? (
                <Options setOptions={setGameOptions} mode="local"/>
            ) : (
                <GameInstance
                    gameState={gameState}
                    handleMove={handleMove}
                    waiting={false}
                    reset={reset}
                />
            )}
        </>
    );
}

export default Local;
