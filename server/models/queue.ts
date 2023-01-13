import { model, Schema } from "mongoose";

const InQueueSchema = new Schema({
    clientId: {
        type: String,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    minHandSize: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const InQueue = model('InQueue', InQueueSchema);

export default InQueue;
