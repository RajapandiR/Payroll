import express, { NextFunction, Response, Request } from "express";
import "dotenv/config";
import { AuthRouter, dbConnect, multer, PayrollRouther } from "./src/helpers/paths";
import { AuthMiddleware } from "./src/middleware/authMiddleware";
import { CompanyRouter } from "./src/controllers/company/router";
const app = express();
app.use(express.json());
const port = process.env.PORT;
console.log(port);

dbConnect.createConnection()

app.use("/user/auth", AuthRouter);

app.use("/payroll", PayrollRouther)
app.use("/company",AuthMiddleware.loginMiddleware, CompanyRouter)


// app.use(function(err:any, req:any, res:any, next:any) {
//    if (err instanceof multer.MulterError) {    
//       return res.status(418).send(err.code);
//   }
//     res.status(404).json({error: "mes"})
//     next();
//   });

app.use(function (req: any, res: any, next: any) {

  res.status(404).json({ error: "mes" })
  next();
});

app.listen(port, () => {
  console.log(`Server on ${port}`);

})