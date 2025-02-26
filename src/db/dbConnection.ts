import mongoose from "mongoose";
import { CONSTANTS } from "../helpers/constants";

const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const DBURL = process.env.DB_URL!;

class connectDB {
    constructor() { }

    createConnection = () => {
        mongoose.connect(DBURL).then(() => console.log("DB Connected")).catch((err) => console.log(err));
        
    };

    // getDBConnection = () => {
    //     return mongoose;
    // };

}

export const dbConnect = new connectDB(); 