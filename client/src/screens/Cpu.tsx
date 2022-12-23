import React, { useState } from "react";
import Game from "../components/Game";
import Options from "../components/Options";

interface Setup {
    player1: string;
    player2: string;
    startingPlayer: "P1" | "P2";
}

interface GameOptions {
    size: number;
    minHandSize: number;
    cpuDifficulty?: number;
}

function Cpu() {
    const [setup, setSetup] = useState<Setup | null>(null);
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);

    async function getIfPlayerTurn() {
        // TODO: get if player turn from server
        return true;
    }

    async function getGameState() {
        // TODO: get game state from server
        return false;
    }

    function handleDifficulty() {
        const start = Math.random() > 0.5 ? "P1" : "P2";

        let p1 = "HUMAN";
        let p2 = "CPU";
        if (Math.random() > 0.5) {
            p1 = "CPU";
            p2 = "HUMAN";
        }

        setSetup({
            player1: p1,
            player2: p2,
            startingPlayer: start,
        });
    }

    const submitHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleDifficulty();
    };

    return (
        <>
            {setup === null ? (
                <Options setOptions={setGameOptions} mode="cpu" />
            ) : (
                <Game
                    setup={setup}
                    playerTurn={getIfPlayerTurn}
                    gameState={getGameState}
                    options={null}
                />
            )}
        </>
    );
}

export default Cpu;
