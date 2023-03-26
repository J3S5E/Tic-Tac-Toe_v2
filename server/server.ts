import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
dotenv.config()
const app = express();

const databaseUrl = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_DEV_URL;
if (!databaseUrl) {
    throw new Error("No database url");
}

import { GameOptions, PlayerMove } from "./game.interface";
import { AddPlayerToQueue, ProcessPlayerMove, SendGameStatus } from "./online-logic.js";
import { ProcessMoveCpu, SetupCpuGame, SendCpuGameStatus } from "./cpu-logic.js";

const SOCKET_PORT = Number(process.env.SOCKET_PORT || "4242");
const EXT_SOCKET_PORT = Number(process.env.EXT_SOCKET_PORT || "4242");
const WEB_PORT = Number(process.env.WEB_PORT || "3001");

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
const io = new Server(SOCKET_PORT, {
    cors: {
        origin: process.env.WEB_CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

console.log(`Cross-Origin Resource Sharing (CORS) enabled for ${process.env.WEB_CLIENT_URL || "*"}`);

// listen for new connections with Ids
io.on("connection", (socket) => {
    console.log("New connection", socket.id);
    io.on('error', console.error);
    const clientId = socket.handshake.auth.id;
    const socketId = socket.id;
    console.log(`New connection`, clientId);

    socket.on("online-game:start", (gameOptions: GameOptions) => {
        AddPlayerToQueue(gameOptions, clientId, socketId);
    });

    socket.on("online-game:move", (move: PlayerMove) => {
        ProcessPlayerMove(move, clientId, socketId);
    });

    socket.on("online-game:check-status", () => {
        SendGameStatus(clientId, socketId);
    });

    socket.on("cpu-game:start", (gameOptions: GameOptions) => {
        SetupCpuGame(gameOptions, clientId, socketId);
    });

    socket.on("cpu-game:move", (move: PlayerMove) => {
        ProcessMoveCpu(move, clientId, socketId);
    });

    socket.on("cpu-game:check-status", () => {
        SendCpuGameStatus(clientId, socketId);
    });
});

io.on('error', console.error);

app.get("/api/port", (req, res) => {
    res.send(EXT_SOCKET_PORT.toString());
});

app.listen(WEB_PORT, () => {
    console.log(`Server running on port ${WEB_PORT}`);
});

export default io;