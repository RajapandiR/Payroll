
import { Schema, Document, mongoose, ObjectId, Utils,  } from "../helpers/paths";

interface IUser extends Document {
    name: string,
    email: any,
    password: string,
    // status: string

}

const UserSchema = new Schema<IUser>({
    name: String,
    // email: { type: String, unique: [true, 'Family  id unique'], required: [true, 'Family  id required'] },
    email: { type: String, },
    password: String,
    // status: { type: String, default: Enum.UserStatus.ACTIVE }


}, Utils.returnSchemaOption());

const UserModel = mongoose.model("user", UserSchema);
export { IUser, UserModel };
