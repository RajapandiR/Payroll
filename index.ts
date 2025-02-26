import express, { NextFunction, Response, Request } from "express";
import "dotenv/config";
import { AuthRouter, dbConnect, multer, PayrollRouther, Responder, UserMsg, CompanyRouter } from "./src/helpers/paths";
import { AuthMiddleware } from "./src/middleware/authMiddleware";
const app = express();
app.use(express.json());
const port = process.env.PORT;
console.log(port);

dbConnect.createConnection()

app.use("/user/auth", AuthRouter);

app.use("/payroll", AuthMiddleware.loginMiddleware, PayrollRouther)
app.use("/company", AuthMiddleware.loginMiddleware, CompanyRouter)

app.use(function (req: any, res: any, next: any) {

  Responder.sendValidationError(UserMsg.req404, res);
  next();
});

app.listen(port, () => {
  console.log(`Server on ${port}`);

})