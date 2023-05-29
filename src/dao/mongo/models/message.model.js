import mongoose from 'mongoose';

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
})

messageSchema.pre('find', function () {
    this.populate('user.user')
})

const MessageModel = mongoose.model(messageCollection, messageSchema)

export default MessageModel;