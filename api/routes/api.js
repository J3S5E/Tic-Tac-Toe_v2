import express from "express";

const apiRouter = express.Router();

// add default routes
apiRouter.get("/", (req, res) => {
    res.send("Hello World");
});

export default apiRouter;