import path from "path";

import { csvParser, fs, Request, Responder, Response, csv, Utils, CompanyModel, UserMsg, EmployeeModel, PayrollModel, Enum } from "../../helpers/paths";


class PayRollController {
    importData = (req: Request, res: Response) => {
        try {
            const file: any = req.file?.originalname;
            const data: any[] = [];
            if (!req.file?.path) return Responder.sendFailureMessage(UserMsg.file404, res);

            fs.createReadStream(process.cwd() + "/" + "uploads/" + file)
                .pipe(csv.parse({ headers: true }))
                .on('data', async (row: any) => {
                
                    const total: any = parseInt(row['Week 1 (Jan 15 - Jan 21)']) + parseInt(row['Week 2 (Jan 22 - Jan 28)']) +
                        parseInt(row['Week 3 (Jan 29 - Feb 4)']) + parseInt(row['Week 4 (Feb 5 - Feb 11)']) + parseInt(row['Week 5 (Feb 12 - Feb 15)']);

                    const obj = {
                        name: row['Employee Name'],
                        email: row['Employee Email'],
                        totalHours: total,
                        dateRange: "2025 Jan 15 to Feb 15",
                        employeeId: row["Employee ID"],
                        hourlyPay: row["Hourly Pay Rate"],
                        amount: parseFloat(total) * parseInt(row["Hourly Pay Rate"])

                    }
                    data.push(obj)
                })
                .on('end', async () => {
                    await EmployeeModel.insertMany(data);
                    fs.unlink(process.cwd() + "/" + "uploads/" + file, () => { })
                    Responder.sendSuccessMessage(UserMsg.import, res);
                })
                .on('error', async (err: any) => {
                    return Responder.sendFailureMessage(err.message, res);
                })
            // .on('error')
        } catch (err: any) {
            return Responder.sendFailureMessage(err.message, res);
        }
    }

    sendMailEmployee = async (req: Request, res: Response) => {

        let company = await CompanyModel.findOne({ _id: req.params.id }, { createdAt: 0, updatedAt: 0 })
        if (!company) return Responder.sendFailureMessage(UserMsg.company404, res)

        let emp = await EmployeeModel.findOne({ _id: req.params.employeeId }, { createdAt: 0, updatedAt: 0 })
        if (!emp) return Responder.sendFailureMessage(UserMsg.company404, res)
        const mailOption = await this.mailOptions(emp)

        const payrollId = await Utils.generatePdf(company, emp) //Temp
        if (mailOption) {
            Utils.sendMail(mailOption, async (info: any) => {
                var status;
                if (info) status = Enum.MailStatus.SENT;
                else status = Enum.MailStatus.FAIL
                await PayrollModel.findOneAndUpdate({ employee: emp._id, payrollId: payrollId }, { $set: { emailStatus: status } })
            })
            Responder.sendSuccessMessage(UserMsg.mail, res);
        }
        else {
            await PayrollModel.findOneAndUpdate({ employee: emp._id, payrollId: payrollId }, { $set: { emailStatus: Enum.MailStatus.FAIL } })
            Responder.sendFailureMessage(UserMsg.mail404, res)
        }
    }

    genaratePdf = async (req: Request, res: Response) => {
        try {
            let company = await CompanyModel.findOne({ _id: req.params.id }, { createdAt: 0, updatedAt: 0 })
            if (!company) return Responder.sendFailureMessage(UserMsg.company404, res)
            let emp = await EmployeeModel.find({}, { createdAt: 0, updatedAt: 0 })
            for (var i of emp) await Utils.generatePdf(company, i)
            Responder.sendSuccessMessage(UserMsg.pdf, res);
        } catch (err: any) {
            return Responder.sendFailureMessage(err.message, res);
        }
    }

    BulkEmail = async (req: Request, res: Response) => {
        try {

            let company = await CompanyModel.findOne({ _id: req.params.id }, { createdAt: 0, updatedAt: 0 })
            if (!company) return Responder.sendFailureMessage(UserMsg.company404, res)
            const file: any = req.file?.originalname;
            const data: any[] = [];
            let hasErr = false;

            if (!req.file?.path) return Responder.sendFailureMessage(UserMsg.file404, res);

            fs.createReadStream(process.cwd() + "/" + "uploads/" + file)
                .pipe(csv.parse({ headers: true }))
                .on('data', async (row: any) => {

                    const total: any = parseInt(row['Week 1 (Jan 15 - Jan 21)']) + parseInt(row['Week 2 (Jan 22 - Jan 28)']) +
                        parseInt(row['Week 3 (Jan 29 - Feb 4)']) + parseInt(row['Week 4 (Feb 5 - Feb 11)']) + parseInt(row['Week 5 (Feb 12 - Feb 15)']);

                    const obj = {
                        name: row['Employee Name'],
                        email: row['Employee email'],
                        totalHours: total,
                        dateRange: "2025 Jan 15 to Feb 15",
                        employeeId: row["Employee ID"],
                        hourlyPay: row["Hourly Pay Rate"],
                        amount: parseFloat(total) * parseInt(row["Hourly Pay Rate"])

                    }
                    data.push(obj)
                })
                .on('end', async () => {
                    this.bulkEmailData(data, company)
                    fs.unlink(process.cwd() + "/" + "uploads/" + file, () => { })
                    Responder.sendSuccessMessage(UserMsg.bulkMail, res);
                })
                .on('error', async (err: any) => {
                    return Responder.sendFailureMessage(err.message, res);
                })

        } catch (err: any) {
            return Responder.sendFailureMessage(err.message, res);
        }
    }

    bulkEmailData = async (data: any, company: any) => {
        for (var i of data) {
            const emp = await EmployeeModel.create(i);
            const payrollId = await Utils.generatePdf(company, emp)
            const mailOption = await this.mailOptions(emp)
            if (mailOption) {
                Utils.sendMail(mailOption, async (info: any) => {
                    var status;
                    if (info) status = Enum.MailStatus.SENT;
                    else status = Enum.MailStatus.FAIL
                    await PayrollModel.findOneAndUpdate({ employee: emp._id, payrollId: payrollId }, { $set: { emailStatus: status } })
                })
            }
            else {
                await PayrollModel.findOneAndUpdate({ employee: emp._id, payrollId: payrollId }, { $set: { emailStatus: Enum.MailStatus.FAIL } })
            }
        }
    }



    mailOptions = async (emp: any) => {
        const payroll: any = await PayrollModel.findOne({ employee: emp._id });
        if (!payroll) return null;
        return {
            to: "rajapandibsc12@gmail.com",
            from: 'noreply@gmail.com',
            subject: "Payslip",
            attachments: [
                {
                    filename: `payslip_${emp.employeeId}.pdf`,
                    path: path.join(payroll.filePath), // Path to the file
                },
            ],

        }
    };
}

export const Controller = new PayRollController();
