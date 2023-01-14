import { schedule } from "node-cron";

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
            gameOver: storedGame.gameOver,
            winner: storedGame.winner
        };
        io.to(socketId).emit("online-game:update", playerGameUpdate);
        return;
    }

    storedGame.gameState = gameState;

    // Update game state in database
    await storedGame.save();

    const playerGameUpdate: GameUpdate = {
        gameState: gameState,
        isPlayerTurn: false,
        gameOver: storedGame.gameOver,
        winner: storedGame.winner
        
    };
    const opponentGameUpdate: GameUpdate = {
        gameState: gameState,
        isPlayerTurn: true,
        gameOver: storedGame.gameOver,
        winner: storedGame.winner
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
            gameOver: storedGame.gameOver,
            winner: storedGame.winner
        };
        if (storedGame.player1Id === clientId) {
            storedGame.player1SocketId = socketId;
        } else {
            storedGame.player2SocketId = socketId;
        }
        await storedGame.save();
        io.to(socketId).emit("online-game:update", playerGameUpdate);
        return;
    }

    // check if player is already in queue
    try {
        const alreadyInQueue = await InQueue.findOne({ clientId: clientId });
        if (alreadyInQueue) {
            alreadyInQueue.socketId = socketId;
            alreadyInQueue.minHandSize = gameOptions.minHandSize;
            alreadyInQueue.size = gameOptions.size;
            alreadyInQueue.name = gameOptions.playerName || "Player " + socketId;
            await alreadyInQueue.save();
            return;
        }
    }
    catch (err) {
        console.log(err);
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

async function SendGameStatus(clientId: string, socketId: string) {
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
            gameOver: storedGame.gameOver,
            winner: storedGame.winner
        };
        if (storedGame.player1Id === clientId) {
            storedGame.player1SocketId = socketId;
        } else {
            storedGame.player2SocketId = socketId;
        }
        await storedGame.save();
        io.to(socketId).emit("online-game:update", playerGameUpdate);
        return;
    } else {
        const allGames = await OnlineGame.find({}).sort({ updatedAt: -1 });

        const storedGame = allGames.find((game) => {
            return game.player1Id === clientId || game.player2Id === clientId;
        });

        if (storedGame) {
            const playerColor = storedGame.player1Id === clientId ? "red" : "blue";
            const playerGameUpdate: GameUpdate = {
                gameState: storedGame.gameState,
                isPlayerTurn: playerColor === storedGame.gameState.currentPlayer,
                gameOver: storedGame.gameOver,
                winner: storedGame.winner
            };
            if (storedGame.player1Id === clientId) {
                storedGame.player1SocketId = socketId;
            } else {
                storedGame.player2SocketId = socketId;
            }
            await storedGame.save();
            io.to(socketId).emit("online-game:update", playerGameUpdate);
            return;
        }
    }
}

export { ProcessPlayerMove, AddPlayerToQueue, SendGameStatus };


schedule("*/10 * * * * *", async function () {
    const playersInQueue = await InQueue.find({}).sort({ updatedAt: 1 });

    if (playersInQueue.length < 2) {
        return;
    }

    for(let i = 0; i < playersInQueue.length; i++) {
        const player1 = playersInQueue[i];
        
        for(let j = i + 1; j < playersInQueue.length; j++) {
            const player2 = playersInQueue[j];
            
            if (player1.size === player2.size && player1.minHandSize === player2.minHandSize) {
                const gameOptions: GameOptions = {
                    size: player1.size,
                    minHandSize: player1.minHandSize
                };
                const game = makeGame(player2.name, player1.name, gameOptions);
                const onlineGame = new OnlineGame({
                    player1Id: player1.clientId,
                    player1SocketId: player1.socketId,
                    player2Id: player2.clientId,
                    player2SocketId: player2.socketId,
                    gameState: game,
                    gameOver: false,
                });
                await onlineGame.save();
                const player1GameUpdate: GameUpdate = {
                    gameState: game,
                    isPlayerTurn: "red" === game.currentPlayer,
                    gameOver: false
                };
                const player2GameUpdate: GameUpdate = {
                    gameState: game,
                    isPlayerTurn: "blue" === game.currentPlayer,
                    gameOver: false
                };
                io.to(player1.socketId).emit("online-game:update", player1GameUpdate);
                io.to(player2.socketId).emit("online-game:update", player2GameUpdate);
                await InQueue.deleteMany({ clientId: { $in: [player1.clientId, player2.clientId] } });
                return;
            }
        }
    }

});


schedule("*/30 * * * * *", async function () {

    // get all current games
    const ongoingGames = await OnlineGame.find({ gameOver: false });

    // find games that have been inactive for 120 seconds
    const inactiveGames = ongoingGames.filter((game) => {
        const lastMoveTime = new Date(game.updatedAt).getTime();
        const currentTime = new Date().getTime();
        return currentTime - lastMoveTime > 120000;
    });

    // end the games
    for (const game of inactiveGames) {
        game.gameOver = true;
        const winner = game.gameState.currentPlayer === "red" ? game.gameState.player1.label : game.gameState.player2.label;
        game.winner = winner;
        await game.save();
    }

});