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
import { isValidMove, updateBoard } from "../shared/actions/local/move";

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

    function handleMove(move: PlayerMove) {
        if (gameState === null) {
            return;
        }
        if (isValidMove(gameState, move)) {
            setGameState(updateBoard(move, gameState));
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
