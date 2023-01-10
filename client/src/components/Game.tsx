import React, { useState } from "react";
import { Game, PlayerMove } from "../shared/interfaces/game.interface";
import ZoomButtons from "./ZoomButtons";
import isGameOver from "../shared/actions/GameOver";
import GameBoardView from "./GameBoard";
import HandInfo from "./HandInfo";

const GameInstance = (props: {
    gameState: Game;
    handleMove: (move: PlayerMove) => void;
    waiting: boolean;
}) => {
    const { gameState, handleMove, waiting } = props;

    const { board, player1, player2, currentPlayer } = gameState;

    const [selected, setSelected] = useState<number | null>(null);
    const [zoom, setZoom] = useState<number>(5);

    const { gameOver, winner } = isGameOver(gameState);

    function getWinnerLabel(): string {
        if (winner === null) {
            return "";
        }
        return winner === player1.color ? player1.label : player2.label;
    }

    function handleClick(row: number, col: number) {
        if (selected === null || waiting || gameOver) {
            return;
        }

        const action =
            currentPlayer === player1.color
                ? player1.hand[selected]
                : player2.hand[selected];

        const move: PlayerMove = {
            row,
            col,
            player: currentPlayer,
            index: selected,
            action,
        };

        handleMove(move);
        setSelected(null);
    }

    return (
        <div className="game-page">
            <div className="game-colors" />
            <ZoomButtons zoom={zoom} setZoom={setZoom} />
            <div className="top">
                <GameBoardView
                    board={board}
                    zoom={zoom}
                    handleClick={handleClick}
                />
            </div>
            <div className="bottom">
                {gameOver ? (
                    <div className="game-over">
                        <h1>Game Over</h1>
                        <h2>{getWinnerLabel()} wins!</h2>
                    </div>
                ) : (
                    <div className="game-info">
                        <HandInfo
                            player={player1}
                            currentPlayer={currentPlayer}
                            selected={selected}
                            setSelected={setSelected}
                            waiting={waiting}
                        />
                        <HandInfo
                            player={player2}
                            currentPlayer={currentPlayer}
                            selected={selected}
                            setSelected={setSelected}
                            waiting={waiting}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameInstance;
