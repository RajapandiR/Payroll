import { Request, Response } from "express"
import { Responder } from "../../helpers/responder";
import { Utils } from "../../helpers/utils";
import { JWT } from "../../helpers/jwt";
import { UserModel, UserMsg, uuidv4 } from "../../helpers/paths";
class Auth {

    createuser = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            if (!data.email || !data.password) return Responder.sendValidationError(UserMsg.invaildData, res);
            const exUser = await UserModel.findOne({ email: data.email })
            if (exUser) return Responder.sendFailureMessage(UserMsg.userEx404, res);
            data.password = await Utils.hashPassword(data?.password)
            const user = await UserModel.create(data);
            if (user) return Responder.sendSuccessMessage(UserMsg.usercreated, res);
            else return Responder.sendFailureMessage(UserMsg.usercreated404, res);
        } catch (err: any) {

            return Responder.sendFailureMessage(err.message, res);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const { email, password } = req.body;
            const user = await UserModel.findOne({ email })

            if (!user) return Responder.sendFailureMessage(UserMsg.user404, res);
            const vaildPwd = await Utils.comparePwd(password, user?.password);
            if (!vaildPwd) return Responder.sendFailureMessage(UserMsg.invalidCred, res);
            const token = await JWT.issueToken({ userId: user._id });
            Responder.sendSuccessDataMessage({ token }, UserMsg.login, res);
        } catch (err: any) {
            return Responder.sendFailureMessage(err.message, res);
        }
    }
}

export const Controller = new Auth()