import mongoose from 'mongoose';

const ticketCollection = 'tickets'

const generateCode = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const ticketSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    code: {
        type: String,
        default: generateCode(),
        unique: true,
    },
    amount: Number,
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
});

ticketSchema.set("timestamps", {
    createdAt: "purchased_datetime",
});

ticketSchema.pre('find', function () {
    this.populate('purchaser')
})


export const TicketModel = mongoose.model(ticketCollection, ticketSchema);