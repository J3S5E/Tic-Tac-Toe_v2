import React, { useEffect, useState } from "react";

const Game = (props) => {


    const { setup } = props;

    const [board, setBoard] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [selected, setSelected] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [zoom, setZoom] = useState(null);

    const minHandSize = 3;
    const amountToAdd = 1;
    const startHandSets = 1;
    const startHandRandoms = 3;

    const size = 6;

    function resetBoard() {
        var newBoard = [];
        for (var i = 0; i < size; i++) {
            newBoard.push([]);
            for (var j = 0; j < size; j++) {
                newBoard[i].push({
                    color: "white",
                    value: " ",
                });
            }
        }
        setBoard(newBoard);
    }

    function handleChoice(player, choice) {
        if (player === currentPlayer && !gameOver) {
            setSelected(parseInt(choice));
        }
    }

    function checkIfValid(y, x) {
        var player = getCurrent();
        var value = board[y][x].value;
        if (selected === null) {
            return false;
        }

        if (board[y][x].color === player.color && value === player.hand[selected]) {
            return false;
        }

        if (value === "🗻" && (player.hand[selected] === "🗻" || player.hand[selected] === "✂")) {
            return false;
        }
        if (value === "✂" && (player.hand[selected] === "✂" || player.hand[selected] === "📰")) {
            return false;
        }
        if (value === "📰" && (player.hand[selected] === "🗻" || player.hand[selected] === "📰")) {
            return false;
        }

        return true;
    }

    function addRandomToHand(hand) {
        var random = Math.floor(Math.random() * 3);
        switch (random) {
            case 0:
                hand.push("🗻");
                break;
            case 1:
                hand.push("📰");
                break;
            case 2:
                hand.push("✂");
                break;
            default:
                break;
        }
    }

    function makeStartHand() {
        var hand = [];
        for (var i = 0; i < startHandSets; i++) {
            hand.push("🗻");
            hand.push("📰");
            hand.push("✂");
        }

        for (i = 0; i < startHandRandoms; i++) {
            addRandomToHand(hand);
        }
        return hand;
    }

    function getCurrent() {
        if (currentPlayer === player1.label) {
            return player1;
        } else {
            return player2;
        }

    }

    function swapPlayer() {
        if (!gameOver) {
            if (currentPlayer === player1.label) {
                setCurrentPlayer(player2.label);
            } else {
                setCurrentPlayer(player1.label);
            }
        }
    }

    function fillHands() {
        if (player1.hand.length < minHandSize) {
            for (var i = 0; i < amountToAdd; i++) {
                addRandomToHand(player1.hand);
            }
        }
        if (player2.hand.length < minHandSize) {
            for (i = 0; i < amountToAdd; i++) {
                addRandomToHand(player2.hand);
            }
        }
    }

    function checkIfColorMatches(array) {
        if (array[0].color === "white") {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i].color !== array[0].color) {
                return false;
            }
        }
        return true;
    }

    function getRow(rowNumber) {
        var row = [];
        for (var i = 0; i < size; i++) {
            row.push(board[rowNumber][i]);
        }
        return row;
    }

    function getColumn(columnNumber) {
        var column = [];
        for (var i = 0; i < size; i++) {
            column.push(board[i][columnNumber]);
        }
        return column;
    }

    function getDiagonal(diagonalNumber) {
        var diagonal = [];
        if (diagonalNumber === 0) {
            for (var i = 0; i < size; i++) {
                diagonal.push(board[i][i]);
            }
        } else {
            for (i = 0; i < size; i++) {
                diagonal.push(board[i][size - i - 1]);
            }
        }
        return diagonal;
    }


    function checkIfGameOver() {

        var over = false;

        for (var i = 0; i < size; i++) {
            var row = getRow(i);
            if (checkIfColorMatches(row)) {
                over = true;
            }
            var column = getColumn(i);
            if (checkIfColorMatches(column)) {
                over = true;
            }
        }
        var diagonal1 = getDiagonal(0);
        if (checkIfColorMatches(diagonal1)) {
            over = true;
        }
        var diagonal2 = getDiagonal(1);
        if (checkIfColorMatches(diagonal2)) {
            over = true;
        }


        if (over) {
            setGameOver(true);
            setWinner(getCurrent().label);
        }

    }

    function endTurn() {
        checkIfGameOver();
        fillHands();
        setSelected(null);
        swapPlayer();
    }

    function handleSelect(y, x) {
        if (checkIfValid(y, x) && !gameOver) {
            var player = getCurrent();
            console.log(player)
            board[y][x].color = player.color;
            board[y][x].value = player.hand[selected];

            // remove from hand
            player.hand.splice(selected, 1);

            endTurn();
        }
    }

    function setDefaultMagnification() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        // calculate 1rem height
        var oneRemWidth = width / 16;
        var remWidthRounded = Math.ceil(oneRemWidth / 10);

        var oneRemHeight = height / 16;
        var remHeightRounded = Math.ceil(oneRemHeight / 10);

        var newSize = remWidthRounded;
        if (remWidthRounded > remHeightRounded) {
            newSize = remHeightRounded;
        }

        setZoom(newSize);

    }


    useEffect(() => {

        resetBoard();

        setDefaultMagnification();

    }, []);


    useEffect(() => {
        if (zoom === null) {
            setDefaultMagnification();
        }
        else if (zoom < 1) {
            setZoom(1);
        }
        else if (zoom > 16) {
            setZoom(16);
        }
    }, [zoom]);


    useEffect(() => {

        // init
        if ((setup !== null || setup !== undefined) && (currentPlayer === null || currentPlayer === undefined)) {

            var startHand = makeStartHand();

            setPlayer1({
                label: setup.player1,
                hand: [...startHand],
                color: "blue"
            });

            startHand = makeStartHand();

            setPlayer2({
                label: setup.player2,
                hand: [...startHand],
                color: "red"
            });

            if (player1 !== null && player2 !== null) {

                if (setup.startingPlayer === "P1") {
                    setCurrentPlayer(player1.label);
                } else {
                    setCurrentPlayer(player2.label);
                }

            }

        }

    }, [board, setup, currentPlayer, player1, player2]);

    return (
        board !== null ? (
            <div className="page">
                <div className="top">
                    <div className="banner">
                        <button className="zoom-out" onClick={((e) => setZoom(zoom - 1))}>
                            🔍-
                        </button>
                        <button className="zoom-in" onClick={((e) => setZoom(zoom + 1))}>
                            +🔎
                        </button>
                    </div>
                    <div className="board">
                        {board.map((row, rownumber) => (
                            <>
                                <div className="board-row">
                                    {row.map((cell, columnnumber) => (
                                        <>
                                            <button className={"board-cell " + cell.color + " size" + zoom} onClick={((e) => handleSelect(rownumber, columnnumber))}>
                                                {cell.value}
                                            </button>
                                            {columnnumber !== size - 1 ? (<div className="vertical-line"></div>) : null}
                                        </>
                                    ))}
                                </div>
                                {rownumber !== size - 1 ? (<div className="horizontal-line"></div>) : null}
                            </>
                        ))}
                    </div>
                </div>
                <div className="bottom">
                    {gameOver ? (
                        <div className="game-over">
                            <h1>Game Over</h1>
                            <h2>{winner} wins!</h2>
                        </div>
                    ) : (
                        <>
                            <div className="game-info">
                                <div className="player-info blue">
                                    {player1 !== null ? (
                                        <>
                                            <div className={currentPlayer === player1.label ? "player-name bold" : "player-name"}>
                                                {player1.label}
                                            </div>
                                            <div className="player-options big_emoji">
                                                {player1.hand.map((e, i) => (
                                                    <button key={i} className={currentPlayer === player1.label && i === selected ? "player-option selected" : "player-option"} value={i} onClick={((e) => handleChoice(player1.label, e.target.value))}>
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                                <div className="player-info red">
                                    {player1 !== null ? (
                                        <>
                                            <div className={currentPlayer === player2.label ? "player-name bold" : "player-name"}>
                                                {player2.label}
                                            </div>
                                            <div className="player-options big_emoji">
                                                {player2.hand.map((e, i) => (
                                                    <button key={i} className={currentPlayer === player2.label && i === selected ? "player-option selected" : "player-option"} value={i} onClick={((e) => handleChoice(player2.label, e.target.value))}>
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        ) : (
            null
        )
    );


}

export default Game;