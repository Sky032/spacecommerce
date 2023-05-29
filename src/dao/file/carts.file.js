import fs from 'fs';
import CustomError from '../../repository/errors/custom.error.js';
import ERRORS from '../../repository/errors/enums.js';
import { generateNotFoundError } from '../../repository/errors/info.js';

export default class Products {

    constructor() {
        this.path = './carts.json';
    }

    #getNextID = data => {
        const count = data.length 
        const nextID = (count > 0) ? data[count-1].id + 1 : 1

        return nextID
    }

    getCarts = () => {
        if(fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8')
            const carts = JSON.parse(data);

            return carts
        }
        return [];
    }

    getCartById = async(cid) => {
        const carts = await this.get();
        const cart = carts.find(p => p.id === cid);
        if(!cart) {
            CustomError.createError({
                name: `Error in deleteProduct: `,
                cause: generateNotFoundError(cid),
                message: `No se encontró el carrito`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        return cart;
    }

    createCart = async() => {
        const carts = await this.getCarts();
        const id = await this.#getNextID(carts)
        const newCart = {
            id: id,
            cart: []
        }
        console.log(`FROM CREATECART IN FILE`, newCart);
        carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(newCart, null, 2))

        return newCart;
    }

    addProduct = async(data) => {
        console.log(data);
        const products = await this.get();
        const id = await this.#getNextID(products)

        const newProduct = {
            id: id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    deleteProduct = async(cid, pid) => {
        const carts = await this.getCarts();
        const findCart = carts.find(cart => cart.cid === cid);
        const findIndex = findCart.findIndex(p => p.pid === pid)
        if(!findIndex) {
            CustomError.createError({
                name: `Error in deleteProduct: `,
                cause: generateNotFoundError(pid),
                message: `No se encontró el producto`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        findCart.products.splice(findIndex, 1);
        
        await fs.promises.writeFile(this.path, JSON.stringify(findCart, null, 2))

        return findCart;  
    }
    
    emptyCart = async(cid) => {
        const carts = await this.getCarts();
        const findCart = carts.find(cart => cart.cid === cid);
        
        findCart.products = []
        carts.push(findCart);
        
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

        return findCart;  
    }
}