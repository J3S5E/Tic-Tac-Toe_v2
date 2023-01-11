import { PlayerMove, Game, GamePiece } from "../../interfaces/game.interface";

function HandleMove(state: Game, move: PlayerMove): Game {
    if (isValidMove(state, move)) {
        return makeMove(state, move);
    } else {
        return state;
    }
}

function doesThisBeatThat(thisPiece: GamePiece, thatPiece: GamePiece): boolean {
    if (thisPiece === "📰") {
        if (thatPiece === "🗻") {
            return true;
        } else {
            return false;
        }
    } else if (thisPiece === "🗻") {
        if (thatPiece === "✂") {
            return true;
        } else {
            return false;
        }
    } else if (thisPiece === "✂") {
        if (thatPiece === "📰") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isValidMove(state: Game, move: PlayerMove): boolean {
    // check if players turn
    if (state.currentPlayer !== move.player) {
        return false;
    }

    // check if space exists
    if (move.row < 0 || move.row >= state.size) {
        return false;
    }
    if (move.col < 0 || move.col >= state.size) {
        return false;
    }

    // check if space is empty
    if (state.board[move.row][move.col].color === null) {
        return true;
    }

    // get space piece
    const spacePiece = state.board[move.row][move.col].value;
    if (spacePiece === null) {
        return true;
    }
    if (doesThisBeatThat(move.action, spacePiece)) {
        return true;
    } else {
        return false;
    }
}

function makeMove(state: Game, move: PlayerMove): Game {
    const newState = { ...state };

    // change currentPlayer
    newState.currentPlayer = newState.currentPlayer === "red" ? "blue" : "red";

    // update board
    newState.board[move.row][move.col].color = move.player;
    newState.board[move.row][move.col].value = move.action;

    // remove piece from hand
    if (newState.player1.color === move.player) {
        // remove a single piece from the hand
        if (move.index < newState.player1.hand.length && move.index >= 0) {
            newState.player1.hand.splice(move.index, 1);
        } else {
            const index = newState.player1.hand.indexOf(move.action);
            if (index > -1) {
                newState.player1.hand.splice(index, 1);
            }
        }
    } else {
        // remove a single piece from the hand
        if (move.index < newState.player2.hand.length && move.index >= 0) {
            newState.player2.hand.splice(move.index, 1);
        } else {
            const index = newState.player2.hand.indexOf(move.action);
            if (index > -1) {
                newState.player2.hand.splice(index, 1);
            }
        }
    }

    // add new piece to hand if under minHandSize
    if (newState.player1.hand.length < newState.minHandSize) {
        newState.player1.hand.push(getRandomPiece());
    }
    if (newState.player2.hand.length < newState.minHandSize) {
        newState.player2.hand.push(getRandomPiece());
    }

    return newState;
}

function getRandomPiece(): GamePiece {
    const pieces: GamePiece[] = ["🗻", "📰", "✂"];
    const index = Math.floor(Math.random() * pieces.length);
    return pieces[index];
}

export { HandleMove , isValidMove };
