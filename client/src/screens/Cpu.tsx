import React, { useState, useEffect } from "react";
import GameInstance from "../components/Game";
import Options from "../components/Options";
import {
    Game,
    PlayerMove,
    GameOptions,
} from "../shared/interfaces/game.interface";
import { useSocket } from "../shared/contexts/SocketProvider";
import { isValidMove } from "../shared/actions/local/move";

function Cpu() {
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
    const [gameState, setGameState] = useState<Game | null>(null);
    const [waiting, setWaiting] = useState<boolean>(false);

    const socket = useSocket();

    useEffect(() => {
        if (socket === null) {
            return;
        }
        socket.on("cpu-game:update", (update) => {
            const { game, playerTurn } = update;
            setGameState(game);
            if (playerTurn) {
                setWaiting(false);
            } else {
                setWaiting(true);
            }
        });
        return () => {
            socket.off("cpu-game:update");
        };
    }, [socket]);

    function updateBoard(move: PlayerMove) {
        if (gameState === null) {
            return;
        }
        // change currentPlayer
        gameState.currentPlayer = gameState.currentPlayer === "red" ? "blue" : "red";

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
            socket?.emit("cpu-game:move", move);
        }
    }

    useEffect(() => {
        if (gameOptions !== null && socket !== null)
            socket?.emit("cpu-game:start", gameOptions);
    }, [gameOptions, socket]);

    function reset() {
        setGameOptions(null);
        setGameState(null);
    }

    return (
        <>
            {gameState === null || gameOptions === null ? (
                <Options setOptions={setGameOptions} mode="cpu" />
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

export default Cpu;
