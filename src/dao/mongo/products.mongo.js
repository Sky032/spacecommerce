import CustomError from "../../repository/errors/custom.error.js";
import ERRORS from "../../repository/errors/enums.js";
import { generateNoStockError, generateNotFoundError } from "../../repository/errors/info.js";
import ProductModel from "./models/products.model.js";



export default class Products {

    get = async (options, query) => {
        const search = {}
        if (query) {
            search["$or"] = [{
                    title: {
                        $regex: query
                    }
                },
                {
                    description: {
                        $regex: query
                    }
                },
                {
                    category: {
                        $regex: query
                    }
                },
            ]
            const products = await ProductModel.paginate(search, options);
            return products;
        }

        const products = await ProductModel.paginate({}, options);
        return products;
    }

    find = async (data) => {
        const filteredProducts = await ProductModel.find({ _id: data }).lean().exec();
        if (!filteredProducts) {
            CustomError.createError({
                name: `Product search error`,
                cause: generateNotFoundError(data),
                message: `Problema tratando de encontrar el producto. ID ${data} incorrecto.`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }
        return filteredProducts;
    }

    add = async (data) => {
        const newProduct = await ProductModel.create(data);
        return newProduct;
    }

    update = async (id, data) => {
        const updateProduct = await ProductModel.updateOne({ _id: id }, data);
        return updateProduct;
    }

    deleteOne = async (id) => {
        const productToDelete = await ProductModel.deleteOne({ _id: id });
        return productToDelete;
    }

    updateStock = async (pid, quantity) => {
        const product = await this.find(pid);

        if (product.stock < quantity) {
            CustomError.createError({
                name: `Stock Error in products.mongo`,
                cause: generateNoStockError(pid, quantity),
                message: `Not enought stock of the product ${pid} to complete your purchase`,
                code: ERRORS.NO_STOCK_ERROR
            })    
        }

        if(product.stock === 0) {
            const result = await ProductModel.updateOne({ _id: pid },{ $set: { status: false }});
            CustomError.createError({
                name: `Stock Error`,
                cause: generateNoStockError(pid, quantity),
                message: `There's no stock of ${product.description}.`,
                code: ERRORS.NO_STOCK_ERROR
            })    
            return result
        }

        const result = await ProductModel.updateOne({ _id: pid },{ $inc: { stock: -quantity }});
        
        return result;
    }
}