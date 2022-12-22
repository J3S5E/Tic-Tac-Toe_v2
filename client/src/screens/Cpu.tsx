import React, { useState } from "react";
import Game from "../components/Game";

interface Setup {
    player1: string;
    player2: string;
    startingPlayer: "P1" | "P2";
}

function Cpu() {

    const [setup, setSetup] = useState<Setup | null>(null);
    const [difficulty, setDifficulty] = useState("easy");

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
            startingPlayer: start
        });
    }

    const submitHandler = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        handleDifficulty();
    };

    return (
        <>
            {setup === null ? (
                <form onSubmit={submitHandler}>
                    <div className="Menu text-center">
                        <div className="MenuHeader giant_emoji">
                            🤖
                        </div>
                        <div className="MenuItems">
                            <label className="MenuItem radio">
                                <input type="radio" name="difficulty" value="easy" checked={difficulty === "easy"} onChange={((e) => setDifficulty(e.target.value))} />
                                Easy
                            </label>
                            <label className="MenuItem radio">
                                <input type="radio" name="difficulty" value="med" checked={difficulty === "med"} onChange={((e) => setDifficulty(e.target.value))} />
                                Medium
                            </label>
                            <label className="MenuItem radio">
                                <input type="radio" name="difficulty" value="hard" checked={difficulty === "hard"} onChange={((e) => setDifficulty(e.target.value))} />
                                Hard
                            </label>

                            <button type="submit" className="MenuItem btn-default">
                                Start
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <Game setup={setup} playerTurn={getIfPlayerTurn} gameState={getGameState} />
            )}
        </>

    );
}

export default Cpu;