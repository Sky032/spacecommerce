import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String,
    email: {
        unique: true,
        type: String
    },
    password: String,
    rol: {
        type: String,
        default: 'user'
    },
    age: {
        type: Number,
        default: ''
    },
    social: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    documents: {
        type: [],
        name: String,
        reference: String,
        default: []
    },
    last_connection: String
});

userSchema.pre('findOne', function () {
    this.populate('cart')
})

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;