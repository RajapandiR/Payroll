import { CompanyModel, Request, Responder, Response, UserModel, UserMsg, Utils } from '../../helpers/paths';;
class CompanyController {
    constructor() { }
    getCompany = async (req: Request, res: Response) => {
        let company = await CompanyModel.findOne({ _id: req.params.id }, { createdAt: 0, updatedAt: 0 })
        if (company) Responder.sendSuccessDataMessage({ company }, UserMsg.company, res)
        else Responder.sendFailureMessage(UserMsg.company404, res)
    }


    createCompany = async (req: Request, res: Response) => {
        const data = req.body;
        if (!data.email || !data.name) return Responder.sendValidationError(UserMsg.invaildData, res);
        const company = await CompanyModel.create(data);
        if (company) Responder.sendSuccessMessage(UserMsg.companyCreated, res);
        else Responder.sendFailureMessage(UserMsg.companyCreated404, res);
    }

}

export const Controller = new CompanyController();