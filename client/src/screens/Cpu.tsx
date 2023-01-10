import React, { useState, useEffect } from "react";
import GameInstance from "../components/Game";
import Options from "../components/Options";
import { Game, PlayerMove, GameOptions } from "../shared/interfaces/game.interface";
import SetupGame from "../shared/actions/local/setup";
import HandleMove from "../shared/actions/local/move";

function Cpu() {
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
    const [gameState, setGameState] = useState<Game | null>(null);

    function init(gameOptions: GameOptions) {
        // TODO: Setup game with CPU from server
        setGameState(SetupGame(gameOptions));
    }

    function handleMove(move: PlayerMove) {
        if (gameState === null) {
            return;
        }
        // TODO: send move to server
        setGameState(HandleMove(gameState, move));
    }

    // TODO: use socket to listen for CPU move from server


    useEffect(() => {
        if (gameOptions !== null)
            init(gameOptions);
    }, [gameOptions]);

    return (
        <>
            {gameState === null || gameOptions === null ? (
                <Options setOptions={setGameOptions} mode="cpu"/>
            ) : (
                <GameInstance
                    gameState={gameState}
                    handleMove={handleMove}
                    waiting={false}
                />
            )}
        </>
    );
}

export default Cpu;
