import React, { useState } from "react";
import Game from "../components/Game";


function Cpu() {

    const [setup, setSetup] = useState(null);
    const [difficulty, setDifficulty] = useState("easy");

    function handleDifficulty() {

        var start = "P1";
        if (Math.random() > 0.5) {
            start = "P2";
        }

        var p1 = "HUMAN";
        var p2 = "CPU";
        if (Math.random() > 0.5) {
            p1 = "CPU";
            p2 = "HUMAN";
        }

        setSetup({
            player1: p1,
            player2: p2,
            startingPlayer: start,
            difficulty: difficulty,
            online: false
        });
    }

    const submitHandler = (e) => {
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
                <Game setup={setup} />
            )}
        </>

    );
}

export default Cpu;