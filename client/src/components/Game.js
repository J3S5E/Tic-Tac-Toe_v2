import React, { useEffect, useState } from "react";

const Game = (props) => {

    const { setup } = props;

    const [board, setBoard] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [current, setCurrent] = useState(null);

    function resetBoard() {
        var newBoard = [];
        for (var i = 0; i < 9; i++) {
            newBoard.push(i);
        }
        setBoard(newBoard);
    }

    useEffect(() => {

        console.log("test");

        resetBoard();


    }, []);


    useEffect(() => {

        console.log("effect 2")

        // init
        if (setup !== null && current === null) {
            setPlayer1(setup.player1);
            setPlayer2(setup.player2);

            if (setup.startingPlayer === "P1") {
                setCurrent(player1);
            } else {
                setCurrent(player2);
            }
        }

        // check if game is over


    }, [board, setup, current, player1, player2]);

    return (
        board !== null ? (
            <div className="page">
                <div className="top">
                    <div className="board">
                        <div className="board-row">
                            <div className="board-cell">
                                {board[0]}
                            </div>
                            <div className="vertical-line" />
                            <div className="board-cell">
                                {board[1]}
                            </div>
                            <div className="vertical-line" />
                            <div className="board-cell">
                                {board[2]}
                            </div>
                        </div>
                        <div className="horizontal-line" />
                        <div className="board-row">
                            <div className="board-cell">
                                {board[3]}
                            </div>
                            <div className="vertical-line" />
                            <div className="board-cell">
                                {board[4]}
                            </div>
                            <div className="vertical-line" />
                            <div className="board-cell">
                                {board[5]}
                            </div>
                        </div>
                        <div className="horizontal-line" />
                        <div className="board-row">
                            <div className="board-cell">
                                {board[6]}
                            </div>
                            <div className="vertical-line" />
                            <div className="board-cell">
                                {board[7]}
                            </div>
                            <div className="vertical-line" />
                            <div className="board-cell">
                                {board[8]}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="game-info">
                        <div className="player-info blue">
                            <div className="player-name">
                                Jesse
                            </div>
                            <div className="player-options big_emoji">
                                <div className="player-option">
                                    ✂
                                </div>
                                <div className="player-option">
                                    🗻
                                </div>
                                <div className="player-option">
                                    📰
                                </div>
                                <div className="player-option">
                                    ✂
                                </div>
                                <div className="player-option">
                                    🗻
                                </div>
                                <div className="player-option">
                                    📰
                                </div>

                            </div>
                        </div>
                        <div className="player-info red">
                            <div className="player-name">
                                Wendy
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            null
        )
    );


}

export default Game;