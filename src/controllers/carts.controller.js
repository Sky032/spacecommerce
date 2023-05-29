import { CartModel } from '../dao/mongo/models/carts.model.js';
import { CartsService } from '../repository/index.js';
import CustomError from '../repository/errors/custom.error.js';
import { generateNoStockError, generateNotFoundError, generatePermisionError } from '../repository/errors/info.js';
import ERRORS from '../repository/errors/enums.js';
import ProductModel from '../dao/mongo/models/products.model.js';

export const getCarts = async(req, res) => {
    try {
        const result = await CartsService.getCarts();
        return res.status(200).send({ status: 'success', payload: result });

    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const getCartById = async(req, res) => {
    try {
        const cid = req.params.cid;

        const result = await CartsService.getCartById(cid);
        if (result === undefined) {
            CustomError.createError({
                name: `Cart search error`,
                cause: generateNotFoundError(cid),
                message: `Problema tratando de encontrar el carrito. ID ${cid} incorrecto.`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }
        return res.status(200).send({ status: 'success', payload: result });

    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const createCart = async(req, res) => {
    try {
        const data = req.body;
        const result = await CartsService.createCart(data);

        return res.status(200).send({ status: 'success', payload: result });

    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const addProduct = async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const user = req.session.user;

        const product = await ProductModel.findOne({ _id: pid })
        if(product.stock === 0) {
            CustomError.createError({
                name: `addProduct error in carts.mongo.js`,
                cause: generateNoStockError(pid),
                message: `No hay suficiente stock..`,
                code: ERRORS.NO_STOCK_ERROR
            })
            return res.status(500).send({ status: 'error', error: 'Not enough stock' })
        }

        if (user.rol === 'admin') {
            CustomError.createError({
                name: `addProduct error in carts.mongo.js`,
                cause: generatePermisionError(user),
                message: `El rol de ${user.rol} no permite realizar acciones de compra.`,
                code: ERRORS.PERMISION_ERROR
            })
            return res.render('errors/general', {
                style: 'style.css',
                error: `Problema tratando de agregar ${product.description}. No puede agregar al carrito un producto que le pertenece.`,
            })
        }
        
        if (product.owner == user._id) {
            CustomError.createError({
                name: `addProduct error in carts.mongo.js`,
                cause: generatePermisionError(user),
                message: `Problema tratando de agregar ${product.description}. No puede agregar al carrito un producto que le pertenece.`,
                code: ERRORS.PERMISION_ERROR
            })
            return res.render('errors/general', {
                style: 'style.css',
                error: `Problema tratando de agregar ${product.description}. No puede agregar al carrito un producto que le pertenece.`,
            })
        }
        
        const result = await CartsService.addProduct(cid, pid, user);
        const actualizedCart = await CartsService.getCartById(cid);

        return res.status(200).send({ status: 'success', payload: actualizedCart });

    } catch (error) {
        req.logger.error(error.message)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const deleteProduct = async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await CartsService.deleteProduct(cid, pid);
        const actualizeCart = await CartsService.getCartById(cid);

        return res.status(200).send({ status: 'success', payload: actualizeCart });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const emptyCart = async(req, res) => {
    try {
        const cid = req.params.cid

        const result = await CartsService.emptyCart(cid);

        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const purchase = async (req, res) => {
    try {
        const cid = req.params.cid;
        const user = req.session.user

        const result = await CartsService.purchase(cid, user.email);

        return res.status(200).send({ status: 'success', payload: result })

    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}