import {
    GameOptions,
    Game,
    BoardSpace,
    GameBoard,
    GamePiece,
    Player,
} from "../../interfaces/game.interface";

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

function SetupGame(gameOptions: GameOptions): Game {
    const { size, minHandSize } = gameOptions;

    const handSize = minHandSize > size * 2 ? minHandSize : size * 2;

    const player1: Player = {
        hand: randomStartingHand(handSize),
        color: "blue",
        label: "Player 1",
    };

    const player2: Player = {
        hand: randomStartingHand(handSize),
        color: "red",
        label: "Player 2",
    };

    const currentPlayer = Math.random() > 0.5 ? "red" : "blue";

    const board: GameBoard = createBoard(size);

    return {
        board,
        player1,
        player2,
        currentPlayer,
        size,
        minHandSize,
    };
}

export default SetupGame;
