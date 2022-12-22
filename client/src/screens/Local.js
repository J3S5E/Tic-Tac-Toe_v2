import React, { useState, useEffect } from "react";
import Game from "../components/Game";
import Options from "../components/Options";

function Local() {
    const [setup, setSetup] = useState(null);
    const [gameOptions, setGameOptions] = useState(null);

    async function getIfPlayerTurn() {
        return true;
    }

    async function getGameState() {
        return false;
    }

    function init() {
        const start = Math.random() > 0.5 ? "P1" : "P2";

        const p1 = "PLAYER 1";
        const p2 = "PLAYER 2";

        setSetup({
            player1: p1,
            player2: p2,
            startingPlayer: start,
        });
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {setup === null || gameOptions === null ? (
                <Options setOptions={setGameOptions} />
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
