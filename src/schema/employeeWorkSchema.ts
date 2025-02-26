
import { Schema, Document, mongoose, ObjectId, Utils,  } from "../helpers/paths";

interface IEmployee extends Document {
    name: string,
    email: any,
    hourlyPay: string,
    totalHours: string,
    date: any
    dateRange: string
    amount: string
    employeeId: string

}

const EmployeeSchema = new Schema<IEmployee>({
    name: String,
    email: String,
    hourlyPay: String,
    totalHours: String,
    date: {
        from: Date,
        to: Date
    },
    dateRange: String,
    employeeId: String,
    amount: String
    // status: { type: String, default: Enum.EmployeeStatus.ACTIVE }


}, Utils.returnSchemaOption());

const EmployeeModel = mongoose.model("employee_work", EmployeeSchema);
export { IEmployee, EmployeeModel };

