import { Response } from "express"
import { HttpStatus, UserMsg } from "./paths";
interface ResultWithMsg  {
    success: boolean,
    message: string,

}
interface sendFailureMsg  {
    success: boolean,
    message: string,
}
class ResponderClass {

    sendSuccessMessage = (msg: string, res: Response) => {
        let result : ResultWithMsg = {
            success: true,
            message: msg
        }
        res.setHeader("content-type", 'application/json');
        res.end(JSON.stringify(result));
    }


    sendFailureMessage = (msg: string, res: Response) => {
        let result : ResultWithMsg = {
            success: false,
            message: msg
        }
        res.setHeader("content-type", 'application/json');
        res.end(JSON.stringify(result));
    }

    sendSuccessDataMessage = (data:any,msg: string, res: Response) => {
        let result  = {
            success: true,
            message: msg,
            data: data
        }
        res.setHeader("content-type", 'application/json');
        res.end(JSON.stringify(result));
    }

    sendFailureCodeMessage = (message: string, code: number, res: Response) => {
        let result: ResultWithMsg = {
            success: false,
            message: message,
        };
        res.setHeader('content-type', 'application/json');
        res.status(code).end(JSON.stringify(result));
    }

    sendValidationError =  (msg: string, res: Response) =>{
        this.sendFailureCodeMessage(msg, HttpStatus.BAD_REQUEST, res)
    }

    sendNoAuth = (res: Response) => {
        this.sendFailureCodeMessage(UserMsg.userUnAuth, HttpStatus.UNAUTHORIZED, res);
    }

    sendNoUser = (res: Response) => {
        this.sendFailureCodeMessage(UserMsg.user404, HttpStatus.NOT_FOUND, res);
    }
}

export const Responder = new ResponderClass();