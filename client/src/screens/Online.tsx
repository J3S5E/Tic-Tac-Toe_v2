import React, { useState, useEffect } from "react";
import GameInstance from "../components/Game";
import Options from "../components/Options";
import {
    Game,
    PlayerMove,
    GameOptions,
    GameUpdate,
} from "../shared/interfaces/game.interface";
import { useSocket } from "../shared/contexts/SocketProvider";
import { isValidMove } from "../shared/actions/local/move";

function Online() {
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
    const [gameState, setGameState] = useState<Game | null>(null);
    const [waiting, setWaiting] = useState<boolean>(false);

    const socket = useSocket();

    useEffect(() => {
        if (socket === null) {
            return;
        }
        socket.on("online-game:update", (update: GameUpdate) => {
            const { gameState, isPlayerTurn } = update;
            setGameState(gameState);
            if (isPlayerTurn) {
                setWaiting(false);
            } else {
                setWaiting(true);
            }
        });
        return () => {
            socket.off("online-game:update");
        };
    }, [socket]);

    function updateBoard(move: PlayerMove) {
        if (gameState === null) {
            return;
        }
        // change currentPlayer
        gameState.currentPlayer =
            gameState.currentPlayer === "red" ? "blue" : "red";

        // update board
        gameState.board[move.row][move.col].color = move.player;
        gameState.board[move.row][move.col].value = move.action;

        // remove piece from hand
        if (gameState.player1.color === move.player) {
            // remove a single piece from the hand
            if (move.index < gameState.player1.hand.length && move.index >= 0) {
                gameState.player1.hand.splice(move.index, 1);
            } else {
                const index = gameState.player1.hand.indexOf(move.action);
                if (index > -1) {
                    gameState.player1.hand.splice(index, 1);
                }
            }
        }
    }

    function handleMove(move: PlayerMove) {
        if (gameState === null) {
            return;
        }
        if (isValidMove(gameState, move)) {
            updateBoard(move);
            setWaiting(true);
            socket?.emit("online-game:move", move);
        }
    }

    useEffect(() => {
        if (gameOptions !== null && socket !== null) {
            socket?.emit("online-game:start", gameOptions);
            setWaiting(true);
        }
    }, [gameOptions, socket]);

    function reset() {
        setGameOptions(null);
        setGameState(null);
        setWaiting(false);
    }

    return (
        <>
            {gameState === null || gameOptions === null ? (
                <Options
                    setOptions={setGameOptions}
                    mode="online"
                    waiting={waiting}
                />
            ) : (
                <GameInstance
                    gameState={gameState}
                    handleMove={handleMove}
                    waiting={waiting}
                    reset={reset}
                />
            )}
        </>
    );
}

export default Online;
