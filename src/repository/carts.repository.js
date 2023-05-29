import CartDTO from '../dao/DTO/carts.dto.js'

export default class CartRepository {
    
    constructor(dao) {
        this.dao = dao;
    }

    getCarts = async() => {
        return await this.dao.getCarts()
    }

    getCartById = async(id) => {
        return await this.dao.getCartById(id)
    }

    createCart = async() => {
        // const cart = new CartDTO()
        const result = this.dao.createCart()

        return result
    }

    addProduct = async(cid, pid, user) => {
        return this.dao.addProduct(cid, pid, user);
    }

    deleteProduct = async(cid, pid) => {
        return this.dao.deleteProduct(cid, pid)
    }

    emptyCart = async(cid) => {
        return this.dao.emptyCart(cid)
    }

    purchase = async (cid, userEmail) => {
        return this.dao.purchase(cid, userEmail);
    };

    newTicket = async (user, acc) => {
        return this.dao.newTicket(user.email, acc)
    }

}