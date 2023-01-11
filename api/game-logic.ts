import {
    GamePiece,
    GameBoard,
    BoardSpace
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

export { randomStartingHand, getRandomPiece, createBoard };
