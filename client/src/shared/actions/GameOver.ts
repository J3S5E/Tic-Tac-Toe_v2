import { Game, GameColor, BoardSpace } from '../interfaces/game.interface';

interface GameOverInfo {
    winner: GameColor | null;
    gameOver: boolean;
}

function checkSpacesForWinner(spaces: BoardSpace[]): GameColor | null {
    const redSpaces = spaces.filter(space => space.color === 'red');
    const blueSpaces = spaces.filter(space => space.color === 'blue');

    if (redSpaces.length === spaces.length) {
        return 'red';
    } else if (blueSpaces.length === spaces.length) {
        return 'blue';
    } else {
        return null;
    }
}

function isGameOver(state: Game): GameOverInfo {
    
    // check each row for a winner
    for (let row = 0; row < state.size; row++) {
        const spaces: BoardSpace[] = [];
        for (let col = 0; col < state.size; col++) {
            spaces.push(state.board[row][col]);
        }
        const winner = checkSpacesForWinner(spaces);
        if (winner) {
            return { winner, gameOver: true };
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
            return { winner, gameOver: true };
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
        return { winner: diagonal1Winner, gameOver: true };
    }

    const diagonal2Winner = checkSpacesForWinner(diagonal2);
    if (diagonal2Winner) {
        return { winner: diagonal2Winner, gameOver: true };
    }

    // else no winner
    return { winner: null, gameOver: false };
}

export default isGameOver;