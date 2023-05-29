import fs from 'fs';
import CustomError from '../../repository/errors/custom.error.js';
import ERRORS from '../../repository/errors/enums.js';
import { generateNoStockError, generateNotFoundError } from '../../repository/errors/info.js';

export default class Products {

    constructor() {
        this.path = './products.json';
    }

    #getNextID = (data) => {
        const count = data.length 
        const nextID = (count > 0) ? data[count-1].id + 1 : 1

        return nextID
    }

    get = (options, query) => {
        if(fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8')
            const products = JSON.parse(data);

            return products
        }
        return [];
    }

    find = async(pid) => {
        const products = await this.get();
        const product = products.find(p => p.id === pid);
        if(!product) {
            CustomError.createError({
                name: `Error in find from product.file.js: `,
                cause: generateNotFoundError(pid),
                message: `Can't find product`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        return product;
    }

    add = async(data) => {
        console.log(data);
        const products = await this.get();
        const id = await this.#getNextID(products)

        const newProduct = {
            id: id,
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            category: data.category,
            price: data.price,
            code: data.code,
            status: data.status,
            stock: data.stock,
            owner: data.owner
        }

        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        return newProduct;
    }

    update = async (id, data) => {
        const products = await this.get()
        const product = products.find(p => p.id === id)


    }

    deleteOne = async(id) => {
        const products = await this.get();
        const findProduct = products.find(p => p.id === id);
        if(!findProduct) {
            CustomError.createError({
                name: `Error in deleteProduct: `,
                cause: generateNotFoundError(pid),
                message: `No se encontró el producto`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        products.splice(findProduct, 1);
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))

        return findCart;  
    }
    

    updateStock = async (pid, quantity) => {
        const product = await this.find(pid)
        if (product.stock < quantity) {
            CustomError.createError({
                name: `Stock Error in products.file.js`,
                cause: generateNoStockError(pid, quantity),
                message: `Not enought stock of the product ${pid} to complete your purchase`,
                code: ERRORS.NO_STOCK_ERROR
            })    
        }

        if(product.stock === 0) {
            CustomError.createError({
                name: `Stock Error in products.file.js`,
                cause: generateNoStockError(pid, quantity),
                message: `There's no stock of ${product.description}.`,
                code: ERRORS.NO_STOCK_ERROR
            })    
            return result
        }

        product.stock -= quantity

        const result = await fs.promises.writeFile(this.path, JSON.stringify(product, null, 2))
        return result
    }
}