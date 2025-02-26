
import { Responder, Request, Response, JWT, NextFunction, Utils, UserModel, UserMsg } from '../helpers/paths';
class Middleware {

    loginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) return Responder.sendNoAuth(res);

            const token = authorization.split(' ')[1]
            const { userId }: any = await JWT.verifyToken(token);
            const user = await UserModel.findOne({ _id: userId })
            if (!user) return Responder.sendNoUser(res);
            // req.user = user;
            next();
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                return Responder.sendFailureMessage(UserMsg.jwt404, res);
            }
            return Responder.sendFailureMessage(err.message, res);
        }

    }
}

export const AuthMiddleware = new Middleware();