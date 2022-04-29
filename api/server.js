// file imports
import apiRouter from "./routes/api.js";
import express from "express";

// express app
const app = express();

const PORT = 4242;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/api', apiRouter);

// listen on port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});