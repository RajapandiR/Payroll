import { Schema, Document, mongoose, ObjectId, Utils,  } from "../helpers/paths";

interface IPayroll extends Document {
    company: ObjectId,
    employee: ObjectId,
    status: string,
    pdfStatus: string,
    emailStatus: string,
    payrollId: string,
    filePath: string
}

const PayrollSchema = new Schema<IPayroll>({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee_work"},
    company:{ type: mongoose.Schema.Types.ObjectId, ref: "company"},
    status: { type: String },
    pdfStatus: String,
    emailStatus: String,
    payrollId: String,
    filePath: String

}, Utils.returnSchemaOption());

const PayrollModel = mongoose.model("payroll", PayrollSchema);
export { IPayroll, PayrollModel };



