import { CartModel } from '../dao/mongo/models/carts.model.js';
import { TicketModel } from '../dao/mongo/models/tickets.model.js';
import UserModel from '../dao/mongo/models/users.model.js';
import CustomError from '../repository/errors/custom.error.js';
import ERRORS from '../repository/errors/enums.js';
import { generateGeneralError, generateInputError, generateNoLoggedUser } from '../repository/errors/info.js';
import { CartsService, ProductsService, UsersService } from '../repository/index.js';
import { sendMail } from '../utils/nodemailer.js';

export const home = async (req, res) => {
    try {
        const user = req.session.user;
        if(!user) return res.status(200).render('index', { style: 'style.css'})

        const isAdmin = user.rol === 'admin' || user.rol === 'premium';

        return res.status(200).render('index', { 
            style: 'style.css', 
            user,
            isAdmin
        });
    } catch (error) {
        req.logger.error(error.message)
        res.status(500).render('errors/general', {
            style: 'style.css',
            error: error.message
        })
    }
}

export const getProducts = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const query = req.query?.query || req.body?.query || "";
        const sort = req.query?.sort || req.body?.sort || "";

        const options = {
            page: page || 1,
            limit: limit || 10,
            sort: { price: sort || -1 },
            lean: true
        }

        const sendQuery = query ? query[0].toUpperCase() + query.substring(1) : "";
        const result = await ProductsService.get(options, sendQuery);

        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${result.limit}&query=${query || ""}&sort=${sort}` : "";
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${result.limit}&query=${query || ""}&sort=${sort}` : ""; 

        result.isValid = !(page <= 0 || page > result.totalPages);

        const user = req.session.user;
        if(user) {
            const isAdmin = user.rol === 'admin' || user.rol === 'premium';
            
            return res.render('products/products', {
                // style: 'style.css',
                result,
                user,
                isAdmin,
                query: query
            });
        }

        return res.render('products/products', {
            style: 'style.css',
            result,
            user,
            query: query
        });

    } catch (error) {
        req.logger.error(`Error in ${req.url}: ` + error.message)
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}

export const cartById = async (req, res) => {
    try {
        const cid = req.params.cid;

        if(!cid) {
            CustomError.createError({
                name: `Error with cartById in views.controller`,
                cause: generateGeneralError(),
                message: `Problem with the cart id`,
                code: ERRORS.GENERAL_ERROR
            })
        }

        const user = req.session.user;
        const isAdmin = user.rol === 'admin' || user.rol === 'premium';

        const result = await CartsService.getCartById(cid)

        // Logica para pasar el importe total del carrito
        const cart = await CartModel.findOne({ _id: cid })
        const products = Array.from(cart.products);
        const total = products.map(p => {
            let amount = p.product.price * p.quantity;
            return amount
        })
        const acc = total.reduce((acc, acum) => acc + acum, 0)
        // Logica para pasar el importe total del carrito

        return res.render('products/carts', { 
            result,
            user,
            isAdmin,
            acc,
            style: 'style.css'
        })
    } catch (error) {
        req.logger.error(error.message)
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}

export const addNewProdGet = async (req, res) => {
    try {
        const user = req.session.user;

        res.render('products/addNew', {
            style: 'style.css',
            user,
            isAdmin: user.rol === 'admin' || user.rol === 'premium'
        });

    } catch (error) {
        CustomError.createError({
            name: `Views controller error: `,
            cause: generateGeneralError(error),
            message: `Oh oh...`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}

export const addNewProdPost = async (req, res) => {
    try {
        const body = req.body;

        if(!body) {
            CustomError.createError({
                name: `Input Error`,
                cause: generateInputError(),
                message: `Problema con los campos a completar`,
                code: ERRORS.INPUT_ERROR
            })
        }

        const result = await ProductsService.add(body);
        
        return res.redirect('products');
    } catch (error) {
        req.logger.error(`${error.message} at URL: ${req.url}`)
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}

export const productDetails = async (req, res) => {
    try {
        const pid = req.params.pid;
        if(!pid) {
            CustomError.createError({
                name: `Error with productDetail in views.controller`,
                cause: generateGeneralError(),
                message: `Problem with the product id`,
                code: ERRORS.GENERAL_ERROR
            })
        }

        const productFound = await ProductsService.find(pid)

        const user = req.session.user;
        if(!user) {
            return res.status(400).render('errors/general', { 
                style: 'style.css',
                error: 'Please Login first.'
            })
        }
        const isAdmin = user.rol === 'admin' || user.rol === 'premium';

        res.render('products/productDetail', {
            style: 'style.css',
            user,
            isAdmin,
            productFound
        })
    } catch (error) {
        req.logger.error(`${error.message} at URL: ${req.url}`)
        CustomError.createError({
            name: `Views controller error: `,
            cause: generateGeneralError(),
            message: `Oh oh...`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}

export const payment = async(req, res) => {
    try {
        const { cid } = req.params
        const user = req.session.user

        const cart = await CartModel.findOne({ _id: cid })

        const result = await CartsService.purchase(cid, user._id);

        const mailOptions = {
            user: `${user.email}`,
            subject: `Thanks for your purchase.`,
            html:   `<main>
                        <h1>${user.first_name}, we appriciate your trust!</h1>
                        <h3>Your ticket number is ${result.code}</h3>
                        <section>
                            <p>Also, we let you know that this is a fictitious ecommerce store, where we do not sell real products. It's a project for CoderHouse's Backend course. I hope that everything went well and that you haven't encountered major inconveniences while browsing the website</p>
                    </section>
                    </main>`
        }
        await sendMail.send(mailOptions)

        return res.status(200).send({ status: 'success', payload: result })

    } catch (error) {
        req.logger.error(error.message)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const paymentGet = async(req, res) => {
    try {
        const { cid } = req.params
        const user = req.session.user
        const ticket = await TicketModel.findOne({ purchaser: user._id }).lean()
        
        return res.render('products/payment', {
            // style: 'style.css',
            user,
            ticket
        })
    } catch (error) {
        req.logger.error(error.message)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const userAccount = async (req, res) => {
    try {
        const user = req.session.user
        const isAdmin = user.rol === 'admin'
        // const isAdmin = user.rol === 'admin' || user.rol === 'premium';

        if(!user) {
            CustomError.createError({
                name: 'Authentication Error',
                cause: generateNoLoggedUser(),
                message: `Session problem.`,
                code: ERRORS.NO_LOGGED_ERROR
            });
        }
        
        return res.render('users/current', {
            style: 'style.css',
            user,
            isAdmin
        });
    } catch (error) {
        req.logger.error(`Error un userAccount: ${error}, endopoint: ${req.url}`)
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}

export const updateInfo = async (req, res) => {
    try {
        const user = req.session.user;
        const body = req.body;
    
        const updateUser = {
            first_name: body.first_name || user.first_name,
            last_name: body.last_name || user.last_name,
            email: body.email || user.email,
            rol: body.rol || user.rol,
            age: body.age || user.age,
        }

        const update = await UserModel.updateOne({ _id: user._id }, updateUser)
        const newUser = await UsersService.getById(user._id)

        return res.status(200).redirect('/users/current')
    } catch (error) {
        req.logger.error(`Error un updateInfo: ${error}, endopoint: ${req.url}`)
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: error.message
        })
    }
}