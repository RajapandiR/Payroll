
import { Schema, Document, mongoose, ObjectId, Utils, } from "../helpers/paths";

interface IKey extends Document {
    key: string,
    count: number,

}

const KeySchema = new Schema<IKey>({
    key: String,
    count: { type: Number, default: 0 },

}, Utils.returnSchemaOption());

const KeyModel = mongoose.model("key", KeySchema);
export { IKey, KeyModel };
