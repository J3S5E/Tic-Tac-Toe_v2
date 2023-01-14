type GamePiece = "🗻" | "📰" | "✂"
type GameColor = "red" | "blue"

interface BoardSpace {
    color: GameColor | null;
    value: GamePiece | null;
}

type GameBoard = BoardSpace[][];

interface Player {
    hand: GamePiece[];
    color: GameColor;
    label: string;
}

interface Game {
    id?: number,
    board: GameBoard;
    player1: Player;
    player2: Player;
    currentPlayer: GameColor;
    size: number;
    minHandSize: number;
}

interface PlayerMove {
    player: GameColor;
    row: number;
    col: number;
    action: GamePiece;
    index: number;
}

interface GameOptions {
    size: number;
    minHandSize: number;
    playerName?: string;
    cpuDifficulty?: number;
}

interface GameUpdate {
    gameState: Game;
    isPlayerTurn: boolean;
    gameOver: boolean;
    winner?: string;
}

export { Game, BoardSpace, GameBoard, Player, PlayerMove, GameOptions, GamePiece, GameColor, GameUpdate };
