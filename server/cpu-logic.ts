import {
    GameOptions,
    Game,
    GameUpdate,
    PlayerMove,
    GamePiece,
    GameBoard,
    GameColor,
} from "./game.interface";

import CpuGame from "./models/cpu-game.js";

import io from "./server.js";
import {
    checkGameOver,
    isMoveValid,
    makeGame,
    makeMove,
} from "./game-logic.js";

async function SetupCpuGame(
    gameOptions: GameOptions,
    clientId: string,
    socketId: string
) {
    // Check if there is an ongoing game and end them
    const gamesOngoing = await CpuGame.find({ clientId, gameOver: false });
    for (const gameOngoing of gamesOngoing) {
        gameOngoing.gameOver = true;
        gameOngoing.winner = "CPU";
        await gameOngoing.save();
    }

    // Create new game
    const { cpuDifficulty } = gameOptions;
    const initGameState = makeGame("Player", "CPU", gameOptions);

    // Make CPU move if cpu starts
    const gameState =
        initGameState.currentPlayer === "red"
            ? makeCpuMove(initGameState, cpuDifficulty || 1)
            : initGameState;

    // Save game state to database
    const storedGame = new CpuGame({
        clientId,
        gameState,
        cpuDifficulty,
    });
    storedGame.save();

    // Send game state to client
    const gameUpdate: GameUpdate = {
        gameState,
        isPlayerTurn: true,
        gameOver: false,
    };
    io.to(socketId).emit("cpu-game:update", gameUpdate);
}

async function SendCpuGameStatus(clientId: string, socketId: string) {
    try {
        // find games and sort by last modified
        const playerGames = await CpuGame.find({ clientId }).sort({
            updatedAt: -1,
        });

        const storedGame = playerGames[0];

        if (storedGame === undefined) {
            return;
        }

        // Send game state to client
        const gameUpdate: GameUpdate = {
            gameState: storedGame.gameState,
            isPlayerTurn: storedGame.gameState.currentPlayer === "blue",
            gameOver: storedGame.gameOver,
            winner: storedGame.winner
        };

        io.to(socketId).emit("cpu-game:update", gameUpdate);
    } catch (error) {
        console.log(error);
    }
}

async function ProcessMoveCpu(move: PlayerMove, clientId: string, socketId: string) {
    // check that is a player move
    if (move.player !== "blue") {
        return;
    }

    // Get game info from database
    try {
        const storedGame = await CpuGame.findOne({ clientId, gameOver: false });
        if (!storedGame) {
            return;
        }

        if (isMoveValid(storedGame.gameState, move)) {
            storedGame.gameState = makeMove(storedGame.gameState, move);
            storedGame.gameOver = checkGameOver(storedGame.gameState);
            if (storedGame.gameOver) {
                storedGame.winner = "Player";
            }
        } else {
            const gameUpdate: GameUpdate = {
                gameState: storedGame.gameState,
                isPlayerTurn: true,
                gameOver: storedGame.gameOver,
                winner: storedGame.winner,
            };
            io.to(socketId).emit("cpu-game:update", gameUpdate);
            return;
        }

        if (!storedGame.gameOver) {
            // make cpu move
            storedGame.gameState = makeCpuMove(
                storedGame.gameState,
                storedGame.cpuDifficulty
            );
            storedGame.gameOver = checkGameOver(storedGame.gameState);
            if (storedGame.gameOver) {
                storedGame.winner = "CPU";
            }
        }

        // Update game state in database
        await storedGame.save();

        // Send game state to client
        const gameUpdate: GameUpdate = {
            gameState: storedGame.gameState,
            isPlayerTurn: true,
            gameOver: storedGame.gameOver,
            winner: storedGame.winner,
        };
        io.to(socketId).emit("cpu-game:update", gameUpdate);
    } catch (err) {
        console.log(err);
    }
}

export { SetupCpuGame, ProcessMoveCpu, SendCpuGameStatus };

///// Local Functions

function makeCpuMove(gameState: Game, cpuDifficulty: number): Game {
    makeMove(gameState, getCpuMove(gameState, cpuDifficulty));
    // change to player turn
    gameState.currentPlayer = "blue";
    return gameState;
}

function getCpuMove(gameState: Game, cpuDifficulty: number): PlayerMove {
    // Try to win
    const winningMove = canWin(gameState, "red");
    if (winningMove.result && winningMove.move !== null) {
        if (isMoveValid(gameState, winningMove.move)) {
            return winningMove.move;
        }
    }
    // Try to block win
    const playerWinningMove = canWin(gameState, "blue");
    if (playerWinningMove.result && playerWinningMove.move !== null) {
        const blockingMove = blockStrategy(
            gameState,
            playerWinningMove.move,
            cpuDifficulty
        );
        if (blockingMove !== null) {
            if (isMoveValid(gameState, blockingMove)) {
                return blockingMove;
            }
        }
    }

    // Make move based on difficulty
    if (cpuDifficulty === 3) {
        return hardCpuMove(gameState);
    } else if (cpuDifficulty === 2) {
        return mediumCpuMove(gameState);
    } else {
        return easyCpuMove(gameState);
    }
}

function hardCpuMove(gameState: Game): PlayerMove {
    // See who has longest line
    // make strategic move
    return mediumCpuMove(gameState);
}

function mediumCpuMove(gameState: Game): PlayerMove {
    // extend a current line
    // make random move
    return easyCpuMove(gameState);
}

function easyCpuMove(gameState: Game): PlayerMove {
    return makeRandomMove(gameState);
}

function makeRandomMove(gameState: Game): PlayerMove {
    let playerMove = getRandomMove(gameState);
    while (!isMoveValid(gameState, playerMove)) {
        playerMove = getRandomMove(gameState);
    }
    return playerMove;
}

function getRandomMove(gameState: Game): PlayerMove {
    const size = gameState.board.length;
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    const action = getRandomPiece();
    const index = gameState.player2.hand.indexOf(action);
    const move: PlayerMove = { player: "red", row, col, action, index };
    return move;
}

function getRandomPiece(): GamePiece {
    const pieces: GamePiece[] = ["🗻", "📰", "✂"];
    const index = Math.floor(Math.random() * pieces.length);
    return pieces[index];
}

function canWin(
    gameState: Game,
    color: GameColor
): { result: boolean; move: PlayerMove | null } {
    const currentHand =
        color === "blue" ? gameState.player1.hand : gameState.player2.hand;
    const options = [...new Set(currentHand)];
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board.length; j++) {
            for (const option of options) {
                const move: PlayerMove = {
                    player: color,
                    row: i,
                    col: j,
                    action: option,
                    index: currentHand.indexOf(option),
                };
                if (isMoveValid(gameState, move)) {
                    if (doesMoveWin(gameState.board, move)) {
                        return { result: true, move };
                    }
                }
            }
        }
    }
    return { result: false, move: null };
}

function doesMoveWin(board: GameBoard, move: PlayerMove): boolean {
    const { row, col } = move;
    const color = move.player;
    const size = board.length;

    // Check row
    let rowWin = true;
    for (let i = 0; i < size; i++) {
        if (i === col) {
            continue;
        }
        if (board[row][i].color !== color) {
            rowWin = false;
            break;
        }
    }
    if (rowWin) {
        return true;
    }

    // Check column
    let colWin = true;
    for (let i = 0; i < size; i++) {
        if (i === row) {
            continue;
        }
        if (board[i][col].color !== color) {
            colWin = false;
            break;
        }
    }
    if (colWin) {
        return true;
    }

    // Check diagonal
    if (row === col) {
        let diagWin = true;
        for (let i = 0; i < size; i++) {
            if (i === row) {
                continue;
            }
            if (board[i][i].color !== color) {
                diagWin = false;
                break;
            }
        }
        if (diagWin) {
            return true;
        }
    }

    return false;
}

function blockStrategy(
    gameState: Game,
    winningMove: PlayerMove,
    cpuDifficulty: number
): PlayerMove | null {
    const { row, col } = winningMove;
    const currentValue = gameState.board[row][col].value;
    const winnerHand =
        winningMove.player === "blue"
            ? gameState.player1.hand
            : gameState.player2.hand;
    const blockerHand =
        winningMove.player === "blue"
            ? gameState.player2.hand
            : gameState.player1.hand;

    if (currentValue !== null) {
        let action: GamePiece = "📰";
        switch (currentValue) {
            case "🗻":
                action = "📰";
                break;
            case "📰":
                action = "✂";
                break;
            case "✂":
                action = "🗻";
                break;
            default:
                return null;
        }
        const move: PlayerMove = {
            row,
            col,
            action: action,
            index: blockerHand.indexOf(action),
            player: "red",
        };
        return move;
    } else {
        // remove duplicate pieces from hand
        const options = [...new Set(winnerHand)];

        // see if the winner does not have options
        if (options.length < 3) {
            let action: GamePiece | null = null;
            if (!("🗻" in options)) {
                if (blockerHand.indexOf("✂") !== -1) action = "✂";
            }
            if (!("📰" in options)) {
                if (blockerHand.indexOf("🗻") !== -1) action = "🗻";
            }
            if (!("✂" in options)) {
                if (blockerHand.indexOf("📰") !== -1) action = "📰";
            }
            if (action === null) {
                return null;
            }
            const move: PlayerMove = {
                row,
                col,
                action: action,
                index: blockerHand.indexOf(action),
                player: "red",
            };
            return move;
        } else {
            if (cpuDifficulty !== 1) {
                return null;
            } else {
                const move: PlayerMove = {
                    row,
                    col,
                    action: blockerHand[0],
                    index: 0,
                    player: "red",
                };
                return move;
            }
        }
    }
}
