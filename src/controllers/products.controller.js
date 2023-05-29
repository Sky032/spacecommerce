import { ProductsService } from '../repository/index.js';
import { sendMail } from '../utils/nodemailer.js';


export const get = async(req, res) => {
    try {
        const result = await ProductsService.get();

        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const find = async(req, res) => {
    try {
        const pid = req.params.pid;

        const result = await ProductsService.find(pid);
        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const add = async (req, res) => {
    try {
        const data = req.body
        const owner = req.session.user._id

        if(!owner) {
            return res.status(404).send({ status: 'error', message: 'User not found' });
        }
        
        const body = {
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            category: data.category,
            price: data.price,
            code: data.code,
            status: true,
            stock: data.stock,
            owner: owner
        }

        const result = await ProductsService.add(body);

        return res.status(200).send({ status: 'success', payload: result })
    } catch (error) {
        req.logger.error(error.message)
        return res.status(500).send({ status: 'error', error: error.message });
    }
}

export const update = async(req, res) => {
    try {
        const pid = req.params.pid
        const data = req.body

        const result = await ProductsService.update(pid, data);
        req.logger.info(`The product has been updated`);

        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const deleteOne = async(req, res) => {
    try {
        const pid = req.params.pid
        const user = req.session.user

        if (user.rol === 'premium') {
            const mailOptions = {
                user: `${user.email}`,
                subject: `Your product has been deleted.`,
                html:   `<main class="container m-3 text-center">
                            <h2 class="tex-center">This is an automatic advice.</h2>
                            <br>
                            <p class="text-center">You product with the ID: ${pid} has been deleted from our database and is no longer available to buy.</p>
                        </main>`
            }

            await sendMail.send(mailOptions)
        }

        const result = await ProductsService.deleteOne(pid);

        return res.status(200).send({ status: 'success', payload: result })
    } catch (error) {
        req.logger.error(`${error.message} at URL: ${req.url}`)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}