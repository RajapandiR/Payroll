import "dotenv/config";
import jwt from "jsonwebtoken";
const token: any = process.env.TOKEN_SECRET
class JwtClass {
    issueToken = (payload: any) => {
        return jwt.sign(payload, token, {
            expiresIn: '1h',
        })
    }

    verifyToken = (payload: any) => {
        return jwt.verify(payload, token);
    }
}

export const JWT = new JwtClass();