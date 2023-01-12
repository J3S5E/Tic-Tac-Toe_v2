import {
    GameOptions,
    Game,
    GameUpdate,
    PlayerMove,
    GamePiece,
    GameBoard,
    GameColor,
} from "./game.interface";

import OnlineGame from "./models/online-game.js";

import io from "./server.js";

import {
    checkGameOver,
    isMoveValid,
    makeGame,
    makeMove,
} from "./game-logic.js";
import InQueue from "./models/queue.js";

async function ProcessPlayerMove(
    move: PlayerMove,
    clientId: string,
    socketId: string
) {
    const ongoingGames = await OnlineGame.find({ gameOver: false });

    // find the game that the player is in
    const storedGame = ongoingGames.find((game) => {
        return game.player1Id === clientId || game.player2Id === clientId;
    });

    if (!storedGame) {
        return;
    }

    const isPlayer1 = storedGame.player1Id === clientId;

    move.player = storedGame.player1Id === clientId ? "red" : "blue";

    let gameState: Game = storedGame.gameState;

    if (move.player !== gameState.currentPlayer) {
        return;
    }

    if (isMoveValid(gameState, move)) {
        gameState = makeMove(gameState, move);
        storedGame.gameOver = checkGameOver(gameState);
        if (storedGame.gameOver) {
            storedGame.winner = isPlayer1
                ? gameState.player1.label
                : gameState.player2.label;
        }
    } else {
        const playerGameUpdate: GameUpdate = {
            gameState: gameState,
            isPlayerTurn: true,
        };
        io.to(socketId).emit("online-game:update", playerGameUpdate);
        return;
    }

    // Update game state in database
    await storedGame.save();

    const playerGameUpdate: GameUpdate = {
        gameState: gameState,
        isPlayerTurn: false,
    };
    const opponentGameUpdate: GameUpdate = {
        gameState: gameState,
        isPlayerTurn: true,
    };
    const opponentSocketId = isPlayer1
        ? storedGame.player2SocketId
        : storedGame.player1SocketId;
    // send update
    io.to(socketId).emit("online-game:update", playerGameUpdate);
    io.to(opponentSocketId).emit("online-game:update", opponentGameUpdate);
}

async function AddPlayerToQueue(
    gameOptions: GameOptions,
    clientId: string,
    socketId: string
) {
    const ongoingGames = await OnlineGame.find({ gameOver: false });

    // find if there is a game that the player is in
    const storedGame = ongoingGames.find((game) => {
        return game.player1Id === clientId || game.player2Id === clientId;
    });

    // if the player is already in a game, send them the game state
    if (storedGame) {
        const playerColor = storedGame.player1Id === clientId ? "red" : "blue";
        const playerGameUpdate: GameUpdate = {
            gameState: storedGame.gameState,
            isPlayerTurn: playerColor === storedGame.gameState.currentPlayer,
        };
        io.to(socketId).emit("online-game:update", playerGameUpdate);
        return;
    }

    // check if player is already in queue
    const alreadyInQueue = await InQueue.findOne({ clientId: clientId });
    if (alreadyInQueue) {
        alreadyInQueue.socketId = socketId;
        await alreadyInQueue.save();
        return;
    }

    // add player to queue
    const inQueue = new InQueue({
        clientId: clientId,
        socketId: socketId,
        name: gameOptions.playerName || "Player " + socketId,
        size: gameOptions.size,
        minHandSize: gameOptions.minHandSize,
    });
    inQueue.save();
}

export { ProcessPlayerMove, AddPlayerToQueue };



// TODO: run scheduled job to check for players in queue and create games