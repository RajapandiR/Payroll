import express from "express";
import { Controller } from "./controller"
const app = express.Router();

app.post("/", (req, res) => {
    Controller.createCompany(req, res);
})

app.get("/:id", (req, res) => {
    Controller.getCompany(req, res);
})

export const CompanyRouter = app;