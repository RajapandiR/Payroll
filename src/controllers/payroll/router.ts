import express, { NextFunction, Request, Response } from 'express';
import { Controller } from './controller';
import multer from 'multer';
import path from 'path';
import { Responder } from '../../helpers/responder';
import { UserMsg } from '../../resources/message';



const fileSizeLimitErrorHandler = (err: any, req: any, res: any, next: any) => {
    if (err) {
        return Responder.sendValidationError(UserMsg.fileLimit404, res);
    } else {
        next()
    }
}

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, "./uploads")
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, file.originalname)
    },
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    var ext = path.extname(file.originalname);

    if (ext.includes(".csv")) {
        return cb(null, true)
    }
    else cb(null, false)
}
const upload = multer({ storage: storage, fileFilter: fileFilter,  limits: { fileSize: 1222222} });

// var upload = multer({ dest: 'uploads/', fileFilter: fileFilter, limits: { fileSize: 1222222 } });
const app = express.Router();

app.post('/upload', upload.single("file"), fileSizeLimitErrorHandler, (req: any, res: any) => {
    Controller.importData(req, res);
})

app.post('/:id/send-email/:employeeId', (req, res) => {
    Controller.sendMailEmployee(req, res);
})


app.get('/:id/generate-pdf', (req, res) => {
    Controller.genaratePdf(req, res);
})

app.post('/:id/send-bulk-email', upload.single("file"), fileSizeLimitErrorHandler, (req: any, res: any) => {
    Controller.BulkEmail(req, res);
})

export const PayrollRouther = app;