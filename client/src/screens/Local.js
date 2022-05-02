import React, { useState, useEffect } from "react";
import Game from "../components/Game";


function Local() {

    const [setup, setSetup] = useState(null);

    function init() {

        var start = "P1";
        if (Math.random() > 0.5) {
            start = "P2";
        }

        var p1 = "PLAYER 1";
        var p2 = "PLAYER 2";

        setSetup({
            player1: p1,
            player2: p2,
            startingPlayer: start,
            online: false
        });
    }

    useEffect(() => {
        init();
    }, []);


    return (
        <>
            {setup === null ? (
                null
            ) : (
                <Game setup={setup} />
            )}
        </>

    );
}

export default Local;