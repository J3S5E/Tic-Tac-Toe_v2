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

        resetBoard();

    }, []);


    console.log(setup);


    useEffect(() => {

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
        <div className="board">
            <div className="board-row">
                <div className="board-cell">
                    {board[0]}
                </div>
                <div className="board-cell">
                    {board[1]}
                </div>
                <div className="board-cell">
                    {board[2]}
                </div>
            </div>
            <div className="board-row">
                <div className="board-cell">
                    {board[3]}
                </div>
                <div className="board-cell">
                    {board[4]}
                </div>
                <div className="board-cell">
                    {board[5]}
                </div>
            </div>
            <div className="board-row">
                <div className="board-cell">
                    {board[7]}
                </div>
                <div className="board-cell">
                    {board[8]}
                </div>
                <div className="board-cell">
                    {board[9]}
                </div>
            </div>
        </div>
    );


}

export default Game;