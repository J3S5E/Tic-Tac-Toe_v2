import { model, Schema } from "mongoose";

const CpuGameSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    gameState: {
        type: Object,
        required: true,
    },
    cpuDifficulty: {
        type: Number,
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

const CpuGame = model('CpuGame', CpuGameSchema);

export default CpuGame;
