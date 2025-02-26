import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { Enum, fs, KeyModel, PayrollModel } from "./paths";
import path from "path";
// Create a transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your-email@gmail.com', // Your Gmail
//       pass: 'your-app-password',    // Use an App Password (not your Gmail password)
//     },
//   });


class UtilsClass {
    hashPassword = async (pwd: string) => {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(pwd, salt);
    }

    comparePwd = (pwd: string, hashPwd: string) => {
        return bcrypt.compare(pwd, hashPwd);
    }
    returnSchemaOption = () => {
        return {
            versionKey: false,
            timestamps: true
        }
    }

    sendMail = (mailOptions: any, cb: any) => {
        let transporter = nodemailer.createTransport({
            service: "gmail", // Or use 'smtp.example.com' for custom SMTP
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS
            }
        });

        transporter.sendMail(mailOptions, (err: any, response: any) => {
            if (response) {
                // console.log(response)
                cb(response)
            }
            else
                cb(null)
        });

    }

    generatePdf = async (company: any, employee: any) => {
        const obj = {
            company: company._id,
            employee: employee._id,
        }

        try {
            let value: any = await Utils.getIncValue("payroll");
            value = value < 999 ? value < 10 ? "000" + value : (value < 99 ? "00" + value : "0" + value) : value
            // const browser = await puppeteer.launch();
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(60000);
            await page.setDefaultTimeout(60000);
            await page.setJavaScriptEnabled(false);

            // HTML content for the payslip
            const htmlContent = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .container { width: 80%; margin: auto; border: 1px solid #ccc; padding: 20px; }
                .header { text-align: center; }
                .logo { width: 100px; height: auto; }
                h2, h3 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                table, th, td { border: 1px solid black; }
                th, td { padding: 10px; text-align: left; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: gray; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="data:image/jpeg;base64,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" alt="Company Logo" />
                    <h3>Payslip</h3>
                    <p>Pay_${value}</p>

                      
                </div>
                <p><strong>company Name:</strong> ${company.name}</p>
                <p><strong>Email:</strong> ${company.email}</p>
    
                <p><strong>Employee Name:</strong> ${employee.name}</p>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Date of Payslip Generation:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Pay Period:</strong> ${employee.dateRange}</p>
                
                <table>
                    <tr><th>Description</th><th>Amount</th></tr>
                    <tr><td>Total Working Hours</td><td>${employee.totalHours} hrs</td></tr>
                    <tr><td>Hourly Pay Rate</td><td>${employee.hourlyPay}</td></tr>
                    <tr><td>Gross Pay</td><td>${employee.amount}</td></tr>
                    <tr><td>Net Pay</td><td>${employee.amount}</td></tr>
                </table>
    
                <p class="footer">This is a system-generated payslip.</p>
            </div>
        </body>
        </html>
        `;

            var folder = `payslip/${company._id.toHexString()}`
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const outputPath = path.join(folder, `${employee.employeeId}.pdf`);

            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
            await page.pdf({ path: outputPath, format: 'A4' });

            await browser.close();

            await PayrollModel.create({ ...obj, pdfStatus: Enum.PdfStatus.GENERATE, filePath: outputPath, payrollId: value })
            return value;
        } catch (err: any) {
            await PayrollModel.create({ ...obj, pdfStatus: Enum.PdfStatus.FAIL })
        }

    }

    getIncValue = async (key: any) => {
        const count = await KeyModel.findOneAndUpdate({ key: key }, { key: key, $inc: { count: 1 } }, { new: true, upsert: true });
        if (count) return count.count;
        else return 0;
    };

}

export const Utils = new UtilsClass();