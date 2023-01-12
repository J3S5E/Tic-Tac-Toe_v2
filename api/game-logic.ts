import {
    GamePiece,
    GameBoard,
    BoardSpace,
    Player,
    GameOptions,
    Game,
    PlayerMove
} from "./game.interface";

function randomStartingHand(handSize: number): GamePiece[] {
    const newHand: GamePiece[] = [];
    // add the different pieces to the hand
    newHand.push("🗻");
    newHand.push("📰");
    newHand.push("✂");

    // add random pieces to the hand
    while (newHand.length < handSize) {
        newHand.push(getRandomPiece());
    }

    return newHand;
}

function getRandomPiece(): GamePiece {
    const pieces: GamePiece[] = ["🗻", "📰", "✂"];
    const index = Math.floor(Math.random() * pieces.length);
    return pieces[index];
}

function createBoard(size: number): GameBoard {
    const board: GameBoard = [];
    for (let i = 0; i < size; i++) {
        const row: BoardSpace[] = [];
        for (let j = 0; j < size; j++) {
            row.push({
                color: null,
                value: null,
            });
        }
        board.push(row);
    }
    return board;
}

function makeGame(player1Label: string, player2Label: string, gameOptions: GameOptions): Game {

    const { size, minHandSize } = gameOptions;

    const handSize = minHandSize > size * 2 ? minHandSize : size * 2;

    const player1: Player = {
        hand: randomStartingHand(handSize),
        color: "blue",
        label: player1Label,
    };

    const player2: Player = {
        hand: randomStartingHand(handSize),
        color: "red",
        label: player2Label,
    };

    const currentPlayer = Math.random() > 0.5 ? "red" : "blue";

    const board: GameBoard = createBoard(size);

    const initGameState: Game = {
        board,
        player1,
        player2,
        currentPlayer,
        size,
        minHandSize,
    };

    return initGameState;
}


function isMoveValid(state: Game, move: PlayerMove): boolean {
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


function checkGameOver(state: Game): boolean {

    // check each row for a winner
    for (let row = 0; row < state.size; row++) {
        const spaces: BoardSpace[] = [];
        for (let col = 0; col < state.size; col++) {
            spaces.push(state.board[row][col]);
        }
        const winner = checkSpacesForWinner(spaces);
        if (winner) {
            return true;
        }
    }

    // check each column for a winner
    for (let col = 0; col < state.size; col++) {
        const spaces: BoardSpace[] = [];
        for (let row = 0; row < state.size; row++) {
            spaces.push(state.board[row][col]);
        }
        const winner = checkSpacesForWinner(spaces);
        if (winner) {
            return true;
        }
    }

    // check each diagonal for a winner
    const diagonal1: BoardSpace[] = [];
    const diagonal2: BoardSpace[] = [];

    for (let i = 0; i < state.size; i++) {
        diagonal1.push(state.board[i][i]);
        diagonal2.push(state.board[i][state.size - i - 1]);
    }

    const diagonal1Winner = checkSpacesForWinner(diagonal1);
    if (diagonal1Winner) {
        return true;
    }

    const diagonal2Winner = checkSpacesForWinner(diagonal2);
    if (diagonal2Winner) {
        return true;
    }

    // else no winner
    return false;

}

export { makeGame, isMoveValid, makeMove, checkGameOver };



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


function checkSpacesForWinner(spaces: BoardSpace[]): boolean {
    const redSpaces = spaces.filter(space => space.color === 'red');
    const blueSpaces = spaces.filter(space => space.color === 'blue');

    if (redSpaces.length === spaces.length) {
        return true;
    } else if (blueSpaces.length === spaces.length) {
        return true;
    } else {
        return false;
    }
}