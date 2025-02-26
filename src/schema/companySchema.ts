
import { Schema, Document, mongoose, ObjectId, Utils,  } from "../helpers/paths";

interface ICompany extends Document {
    name: string,
    email: any,
    password: string,
    address: any,
    logo: string

}

const CompanySchema = new Schema<ICompany>({
    name: String,
    email: { type: String, },
    address:  {
        line1: String,
        line2: String,
        state: String,
        city: String,
        country: String,
        pin_code: String,
        landmark: String
    },
    logo: String


}, Utils.returnSchemaOption());

const CompanyModel = mongoose.model("company", CompanySchema);
export { ICompany, CompanyModel };

