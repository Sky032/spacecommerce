import config from "../config/config.js";
import mongoose, { connect, set } from "mongoose";

export let Product 
export let Message 
export let Cart
export let User

switch(config.PERSISTENCE) {
    case 'FILE':
        console.log(`Establishing connection with FileSystem...`);

        const { default: ProductFile } = await import('./file/products.file.js')
        const { default: MessageFile } = await import('./file/messages.file.js')
        const { default: CartFile } = await import('./file/carts.file.js')
        const { default: UserFile } = await import('./file/users.file.js')

        Product = ProductFile
        Message = MessageFile
        Cart = CartFile
        User = UserFile

        break;

    default: // default: 'MONGO'
        console.log(`Establishing connection to MongoDB...`);
        
        set('strictQuery', false);
        const connection = mongoose.connect(config.MONGO_URL, { 
            dbName: config.DB_NAME,
        });

        console.log(`You're connected to MongoDB!`);

        const { default: ProductMongo } = await import('./mongo/products.mongo.js')
        const { default: MessageMongo } = await import('./mongo/message.mongo.js')
        const { default: CartMongo } = await import('./mongo/carts.mongo.js')
        const { default: UserMongo } = await import('./mongo/users.mongo.js')

        Product = ProductMongo
        Message = MessageMongo
        Cart = CartMongo
        User = UserMongo

        break;
}