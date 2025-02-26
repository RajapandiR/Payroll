import express from "express";
import { Controller } from "./controller"
const app = express.Router();

app.post("/register", (req, res) => {
    Controller.createuser(req, res);
})

app.post("/login", (req, res) => {
    Controller.login(req, res);
})

export const AuthRouter = app;