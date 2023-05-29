import MessageModel from './models/message.model.js';   

export default class Messages {

    get = async() => {
        const messageLog = await MessageModel.find().lean().exec();

        return messageLog;
    }

    send = async(data) => {        
        try {
            const newMessage = await MessageModel.create(data);

            return newMessage;

        } catch (error) {
            req.logger.error(`Cannot create new product in DB: ${error.message}`);
        }
    }
}