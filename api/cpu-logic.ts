import { GameOptions, Player, GameBoard, Game } from "./game.interface";

import io from "./server.js";
import {randomStartingHand, createBoard} from "./game-logic.js";



function SetupCpuGame(gameOptions: GameOptions, clientId: string, socketId: string) {

    const { size, minHandSize, cpuDifficulty } = gameOptions;
    const handSize = minHandSize > size * 2 ? minHandSize : size * 2;

    const player1: Player = {
        hand: randomStartingHand(handSize),
        color: "blue",
        label: "Player",
    };

    const player2: Player = {
        hand: randomStartingHand(handSize),
        color: "red",
        label: "CPU",
    };

    const currentPlayer = Math.random() > 0.5 ? "red" : "blue";
    const playerTurn = currentPlayer === "blue" ? true : false;

    const board: GameBoard = createBoard(size);

    const game: Game = {
        board,
        player1,
        player2,
        currentPlayer,
        size,
        minHandSize,
    };

    io.to(socketId).emit("cpu-game:update", {
        game,
        playerTurn
    });
}

function ProcessMoveCpu(move: any, clientId: string, socketId: string) {
    // TODO: Is move valid?
        // TODO: Make player move

    // TODO: Make CPU move

    // TODO: send updated game state to client
}

export { SetupCpuGame, ProcessMoveCpu };
