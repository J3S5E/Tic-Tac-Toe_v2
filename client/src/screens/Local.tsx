import React, { useState, useEffect } from "react";
import Game from "../components/Game";
import Options from "../components/Options";

interface GameOptions {
    size: number;
    minHandSize: number;
}

interface Setup {
    player1: string;
    player2: string;
    startingPlayer: "P1" | "P2";
}

function Local() {
    const [setup, setSetup] = useState<Setup | null>(null);
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);

    async function getIfPlayerTurn() {
        return true;
    }

    async function getGameState() {
        return false;
    }

    function init(gameOptions: GameOptions | null) {
        const start = Math.random() > 0.5 ? "P1" : "P2";

        const p1 = "PLAYER 1";
        const p2 = "PLAYER 2";

        setSetup({
            player1: p1,
            player2: p2,
            startingPlayer: start,
        });

        // TODO: make start game state
        
    }

    useEffect(() => {
        init(gameOptions);
    }, [gameOptions]);

    return (
        <>
            {setup === null || gameOptions === null ? (
                <Options setOptions={setGameOptions} mode="local"/>
            ) : (
                <Game
                    setup={setup}
                    playerTurn={getIfPlayerTurn}
                    gameState={getGameState}
                    options={gameOptions}
                />
            )}
        </>
    );
}

export default Local;
