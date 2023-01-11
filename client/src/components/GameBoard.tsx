import React from "react";
import { GameBoard } from "../shared/interfaces/game.interface";

const GameBoardView = (props: {
    board: GameBoard;
    zoom: number;
    handleClick: (row: number, col: number) => void;
}) => {
    const { board, zoom } = props;
    return (
        <div className="board">
            {board.map((row, i) => {
                return (
                    <div className="row" key={i}>
                        {row.map((cell, j) => {
                            return (
                                <div
                                    className={
                                        "board-cell big_emoji " +
                                        cell.color +
                                        " size" +
                                        zoom
                                    }
                                    key={j}
                                    onClick={(e) => props.handleClick(i, j)}
                                >
                                    {cell.value}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default GameBoardView;
