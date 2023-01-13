import { model, Schema } from "mongoose";

const OnlineGameSchema = new Schema({
    player1Id: {
        type: String,
        required: true,
    },
    player1SocketId: {
        type: String,
        required: true,
    },
    player2Id: {
        type: String,
        required: true,
    },
    player2SocketId: {
        type: String,
        required: true,
    },
    gameState: {
        type: Object,
        required: true,
    },
    winner: {
        type: String,
        required: false,
    },
    gameOver: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const OnlineGame = model('OnlineGame', OnlineGameSchema);

export default OnlineGame;
