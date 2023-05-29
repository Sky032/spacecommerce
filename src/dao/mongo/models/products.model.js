import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    category: String,
    price: Number,
    code: {
        type: String,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

productSchema.plugin(mongoosePaginate);

productSchema.pre('find', function () {
    this.populate('owner')
})

const ProductModel = mongoose.model(productCollection, productSchema);

export default ProductModel;