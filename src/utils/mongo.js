import { connect, set } from "mongoose";
import config from "../config/config.js";
import { GeneralError } from "./error.utils.js";

export const connectMongo = async() => {
    try {
        set('strictQuery', false);
        await connect(config.MONGO_URL, { dbName: config.DB_NAME });

        req.logger.info(`You're connected to MongoDB!`);

    } catch (error) {
        if(error) {
            procces.exit();
            throw new GeneralError(`We have trubles trying to connect to MongoDB` + error.message);
        }
    }
}