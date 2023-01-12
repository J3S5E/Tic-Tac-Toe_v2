import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const databaseUrl = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_DEV_URL;
if (!databaseUrl) {
    throw new Error("No database url");
}

import { GameOptions, PlayerMove } from "./game.interface";
import { ProcessMoveCpu, SetupCpuGame } from "./cpu-logic.js";

const PORT = 4242;

mongoose.set('strictQuery', false);

// connect to mongodb
mongoose.connect(databaseUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err: Error) => {
        console.log('Error connecting to MongoDB: ', err.message);
        process.exit();
    });


// set up socket.io
const io = new Server(PORT, {
    cors: {
        origin: process.env.WEB_HOST || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// listen for new connections with Ids
io.on("connection", (socket) => {
    const clientId = socket.handshake.auth.id;
    const socketId = socket.id;
    console.log(`New connection`, clientId);

    socket.on("online-game:start", (gameOptions: GameOptions) => {
        // TODO
        console.log(gameOptions);
    });

    socket.on("online-game:move", (move: PlayerMove) => {
        // TODO
        console.log(move);
    });

    socket.on("cpu-game:start", (gameOptions: GameOptions) => {
        SetupCpuGame(gameOptions, clientId, socketId);
    });

    socket.on("cpu-game:move", (move: PlayerMove) => {
        ProcessMoveCpu(move, clientId, socketId);
    });
});


export default io;