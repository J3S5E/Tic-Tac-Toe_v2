import React, { useEffect, useState } from "react";

const Game = (props) => {


    const { setup } = props;

    const [board, setBoard] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [current, setCurrent] = useState(null);
    const [selected, setSelected] = useState(null);

    const minHandSize = 3;
    const startHandSets = 2;
    const startHandRandoms = 6;

    function resetBoard() {
        var newBoard = [];
        for (var i = 0; i < 9; i++) {
            newBoard.push({
                color: "white",
                value: " ",
            });
        }
        setBoard(newBoard);
    }

    function handleChoice(player, choice) {
        if (player === current) {
            setSelected(parseInt(choice));
        }
    }

    function checkIfValid(cell) {
        var player = getCurrent();
        var value = board[cell].value;
        if (selected === null) {
            return false;
        }

        if (board[cell].color === player.color && value === player.hand[selected]) {
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

    function makeStartHand() {
        var hand = [];
        for (var i = 0; i < startHandSets; i++) {
            hand.push("🗻");
            hand.push("📰");
            hand.push("✂");
        }

        for (var i = 0; i < startHandRandoms; i++) {
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
            }
        }
        return hand;
    }

    function getCurrent() {
        if (current === player1.label) {
            return player1;
        } else {
            return player2;
        }

    }

    function swapPlayer() {
        if (current === player1.label) {
            setCurrent(player2.label);
        } else {
            setCurrent(player1.label);
        }
    }

    function fillHands() {
        if (player1.hand.length < minHandSize) {
            var random = Math.floor(Math.random() * 3);
            switch (random) {
                case 0:
                    player1.hand.push("🗻");
                    break;
                case 1:
                    player1.hand.push("📰");
                    break;
                case 2:
                    player1.hand.push("✂");
                    break;
            }
        }
        if (player2.hand.length < minHandSize) {
            var random = Math.floor(Math.random() * 3);
            switch (random) {
                case 0:
                    player2.hand.push("🗻");
                    break;
                case 1:
                    player2.hand.push("📰");
                    break;
                case 2:
                    player2.hand.push("✂");
                    break;
            }
        }
    }

    function endTurn() {
        fillHands();
        setSelected(null);
        swapPlayer();
    }

    function handleSelect(cell) {
        if (checkIfValid(cell)) {
            var player = getCurrent();
            console.log(player)
            board[cell].color = player.color;
            board[cell].value = player.hand[selected];

            // remove from hand
            player.hand.splice(selected, 1);

            endTurn();
        }
    }

    useEffect(() => {

        resetBoard();


    }, []);


    useEffect(() => {

        // init
        if ((setup !== null || setup !== undefined) && (current === null || current === undefined)) {

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
                    setCurrent(player1.label);
                } else {
                    setCurrent(player2.label);
                }

            }

        }

    }, [board, setup]);

    return (
        board !== null ? (
            <div className="page">
                <div className="top">
                    <div className="board">
                        <div className="board-row">
                            <button className={"board-cell " + board[0].color} onClick={((e) => handleSelect(0))}>
                                {board[0].value}
                            </button>
                            <div className="vertical-line" />
                            <button className={"board-cell " + board[1].color} onClick={((e) => handleSelect(1))}>
                                {board[1].value}
                            </button>
                            <div className="vertical-line" />
                            <button className={"board-cell " + board[2].color} onClick={((e) => handleSelect(2))}>
                                {board[2].value}
                            </button>
                        </div>
                        <div className="horizontal-line" />
                        <div className="board-row">
                            <button className={"board-cell " + board[3].color} onClick={((e) => handleSelect(3))}>
                                {board[3].value}
                            </button>
                            <div className="vertical-line" />
                            <button className={"board-cell " + board[4].color} onClick={((e) => handleSelect(4))}>
                                {board[4].value}
                            </button>
                            <div className="vertical-line" />
                            <button className={"board-cell " + board[5].color} onClick={((e) => handleSelect(5))}>
                                {board[5].value}
                            </button>
                        </div>
                        <div className="horizontal-line" />
                        <div className="board-row">
                            <button className={"board-cell " + board[6].color} onClick={((e) => handleSelect(6))}>
                                {board[6].value}
                            </button>
                            <div className="vertical-line" />
                            <button className={"board-cell " + board[7].color} onClick={((e) => handleSelect(7))}>
                                {board[7].value}
                            </button>
                            <div className="vertical-line" />
                            <button className={"board-cell " + board[8].color} onClick={((e) => handleSelect(8))}>
                                {board[8].value}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="game-info">
                        <div className="player-info blue">
                            {player1 !== null ? (
                                <>
                                    <div className={current === player1.label ? "player-name bold" : "player-name"}>
                                        {player1.label}
                                    </div>
                                    <div className="player-options big_emoji">
                                        {player1.hand.map((e, i) => (
                                            <button key={i} className={current === player1.label && i === selected ? "player-option selected" : "player-option"} value={i} onClick={((e) => handleChoice(player1.label, e.target.value))}>
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
                                    <div className={current === player2.label ? "player-name bold" : "player-name"}>
                                        {player2.label}
                                    </div>
                                    <div className="player-options big_emoji">
                                        {player2.hand.map((e, i) => (
                                            <button key={i} className={current === player2.label && i === selected ? "player-option selected" : "player-option"} value={i} onClick={((e) => handleChoice(player2.label, e.target.value))}>
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : null}
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