import mongoose from "mongoose";

const resetCollection = 'resetPassword'

const resetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    token: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: new Date(),
        expires: 3600,
    },
});

const resetModel = mongoose.model(resetCollection, resetSchema);

export default resetModel;