import React, { useEffect, useState } from "react";

interface BoardSpace {
    color: string;
    value: string;
}
type GameBoard = BoardSpace[][];

interface player {
    hand: string[];
    color: string;
    label: string;
}

const Game = (props: {
    setup: any;
    playerTurn: any;
    gameState: any;
    options: any;
}) => {
    const { setup, playerTurn, gameState, options } = props;

    const [board, setBoard] = useState<GameBoard | null>(null);
    const [player1, setPlayer1] = useState<player | null>(null);
    const [player2, setPlayer2] = useState<player | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
    const [selected, setSelected] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [zoom, setZoom] = useState<number>(5);

    const minHandSize = options.minHandSize;
    const size = options.size;

    function divideAndRoundUp(a: number, b: number) {
        return Math.ceil(a / b);
    }

    function resetBoard() {
        const newBoard: GameBoard = [];
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

    function handleChoice(player: string, choice: string) {
        if (player === currentPlayer && !gameOver) {
            setSelected(parseInt(choice));
        }
    }

    function checkIfValid(y: number, x: number) {
        if (board === null) {
            return false;
        }
        var player = getCurrent();
        var value = board[y][x].value;
        if (selected === null) {
            return false;
        }

        if (
            board[y][x].color === player.color &&
            value === player.hand[selected]
        ) {
            return false;
        }

        if (
            value === "🗻" &&
            (player.hand[selected] === "🗻" || player.hand[selected] === "✂")
        ) {
            return false;
        }
        if (
            value === "✂" &&
            (player.hand[selected] === "✂" || player.hand[selected] === "📰")
        ) {
            return false;
        }
        if (
            value === "📰" &&
            (player.hand[selected] === "🗻" || player.hand[selected] === "📰")
        ) {
            return false;
        }

        return true;
    }

    function addRandomToHand(hand: string[]) {
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

    function makeStartHand(): string[] {
        const hand = [];
        for (let i = 0; i < divideAndRoundUp(size - 2, 3); i++) {
            hand.push("🗻");
            hand.push("📰");
            hand.push("✂");
        }

        for (let i = 0; i < size; i++) {
            addRandomToHand(hand);
        }
        return hand;
    }

    function getCurrent(): player {
        if (player1 === null || player2 === null) {
            throw new Error("player1 or player2 is null");
        }
        if (currentPlayer === player1.label) {
            return player1;
        } else {
            return player2;
        }
    }

    function swapPlayer() {
        if (player1 === null || player2 === null) {
            throw new Error("player1 or player2 is null");
        }
        if (!gameOver) {
            if (currentPlayer === player1.label) {
                setCurrentPlayer(player2.label);
            } else {
                setCurrentPlayer(player1.label);
            }
        }
    }

    function fillHands() {
        if (player1 === null || player2 === null) {
            throw new Error("player1 or player2 is null");
        }
        if (player1.hand.length < minHandSize) {
            for (var i = 0; i < divideAndRoundUp(size, 3); i++) {
                addRandomToHand(player1.hand);
            }
        }
        if (player2.hand.length < minHandSize) {
            for (i = 0; i < divideAndRoundUp(size, 3); i++) {
                addRandomToHand(player2.hand);
            }
        }
    }

    function checkIfColorMatches(array: BoardSpace[]) {
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

    function getRow(rowNumber: number) {
        if (board === null) {
            throw new Error("board is null");
        }
        var row = [];
        for (var i = 0; i < size; i++) {
            row.push(board[rowNumber][i]);
        }
        return row;
    }

    function getColumn(columnNumber: number) {
        if (board === null) {
            throw new Error("board is null");
        }
        var column = [];
        for (var i = 0; i < size; i++) {
            column.push(board[i][columnNumber]);
        }
        return column;
    }

    function getDiagonal(diagonalNumber: number) {
        if (board === null) {
            throw new Error("board is null");
        }
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

    async function handleSelect(y: number, x: number) {
        if (board === null) {
            throw new Error("board is null");
        }
        if (player1 === null || player2 === null) {
            throw new Error("player1 or player2 is null");
        }
        if (selected === null) {
            throw new Error("selected is null");
        }

        const pTurn = await playerTurn();
        if (checkIfValid(y, x) && !gameOver && pTurn) {
            const player = getCurrent();
            board[y][x].color = player.color;
            board[y][x].value = player.hand[selected];

            // remove from hand
            player.hand.splice(selected, 1);

            endTurn();
        } else {
            await gameState();
        }
    }


    useEffect(() => {
        resetBoard();
    }, []);

    useEffect(() => {
        if (zoom < 1) {
            setZoom(1);
        } else if (zoom > 16) {
            setZoom(16);
        }
    }, [zoom]);

    useEffect(() => {
        // init
        if (
            (setup !== null || setup !== undefined) &&
            (currentPlayer === null || currentPlayer === undefined)
        ) {
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
                color: "red",
            });

            if (player1 !== null && player2 !== null) {
                if (setup.startingPlayer === "P1") {
                    setCurrentPlayer(player1.label);
                } else {
                    setCurrentPlayer(player2.label);
                }
            }
        }

        // eslint-disable-next-line
    }, [board, setup, currentPlayer, player1, player2]);

    return board !== null ? (
        <div className="game-page">
            <div className="game-colors" />
            <div className="top">
                <div className="banner">
                    <button
                        className="zoom-out"
                        onClick={(e) => setZoom(zoom - 1)}
                    >
                        🔍-
                    </button>
                    <button
                        className="zoom-in"
                        onClick={(e) => setZoom(zoom + 1)}
                    >
                        +🔎
                    </button>
                </div>
                <div className="board">
                    {board.map((row, rowNumber) => (
                        <>
                            <div className="board-row">
                                {row.map((cell, columnNumber) => (
                                    <>
                                        <button
                                            className={
                                                "board-cell " +
                                                cell.color +
                                                " size" +
                                                zoom
                                            }
                                            onClick={(e) =>
                                                handleSelect(
                                                    rowNumber,
                                                    columnNumber
                                                )
                                            }
                                        >
                                            {cell.value}
                                        </button>
                                        {columnNumber !== size - 1 ? (
                                            <div className="vertical-line" />
                                        ) : null}
                                    </>
                                ))}
                            </div>
                            {rowNumber !== size - 1 ? (
                                <div className="horizontal-line" />
                            ) : null}
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
                            <div className="player-info">
                                {player1 !== null ? (
                                    <>
                                        <div
                                            className={
                                                currentPlayer === player1.label
                                                    ? "player-name bold"
                                                    : "player-name"
                                            }
                                        >
                                            {player1.label}
                                        </div>
                                        <div className="player-options big_emoji">
                                            {player1.hand.map((e, i) => (
                                                <button
                                                    key={i}
                                                    className={
                                                        currentPlayer ===
                                                            player1.label &&
                                                        i === selected
                                                            ? "player-option selected"
                                                            : "player-option"
                                                    }
                                                    value={i}
                                                    onClick={(e: any) =>
                                                        handleChoice(
                                                            player1.label,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            <div className="player-info">
                                {player2 !== null ? (
                                    <>
                                        <div
                                            className={
                                                currentPlayer === player2.label
                                                    ? "player-name bold"
                                                    : "player-name"
                                            }
                                        >
                                            {player2.label}
                                        </div>
                                        <div className="player-options big_emoji">
                                            {player2.hand.map((e, i) => (
                                                <button
                                                    key={i}
                                                    className={
                                                        currentPlayer ===
                                                            player2.label &&
                                                        i === selected
                                                            ? "player-option selected"
                                                            : "player-option"
                                                    }
                                                    value={i}
                                                    onClick={(e: any) =>
                                                        handleChoice(
                                                            player2.label,
                                                            e.target.value
                                                        )
                                                    }
                                                >
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
    ) : null;
};

export default Game;
