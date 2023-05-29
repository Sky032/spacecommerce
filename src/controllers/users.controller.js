import config from '../config/config.js';
import CustomError from '../repository/errors/custom.error.js';
import ERRORS from '../repository/errors/enums.js';
import { generateGeneralError, generateNotFoundError } from '../repository/errors/info.js';
import { UsersService } from '../repository/index.js';
import { sendMail } from '../utils/nodemailer.js';


export const registerGet = async(req, res) => {
    try {
        return res.render(`users/register`, {
            style: 'style.css'
        })
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const registerPost = async(req, res) => {
    try {
        if(!req.user) {
            return res.status(400)
        }
        const newAccountMail = {
            user: `${req.user.email}`,
            subject: `Thanks for registering.`,
            html:   `<main class="container m-3 text-center" style="font-family: 'Roboto', sans-serif;">
                        <h1 class="m-5">Hi ${req.user.first_name}, welcome!!</h1>
                        <br>
                        <hr>
                        <h4>You've created an account in our website, your starting role is: ${req.user.rol}</h4>
                        <p class="m-5">I want to let you know that this is a fictitious ecommerce store, where we do not sell real products. It's a project for CoderHouse's Backend course.</p>
                        <p>I hope that you find everything that you're looking for!</p>
                        <hr>
                        <p class="m-5">If you wanna keep looking the website, be my guest!!! Click <a href="${config.BASE_URL}/home">here</a>!
                    </main>`
        }
        await sendMail.send(newAccountMail)

        return res.status(200).redirect('/users/login');
    } catch (error) {
        req.logger.error(`From resgisterPost: ${error.message}`);
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginGet = async(req, res) => {
    try {
        return res.render('users/login', {
            style: 'style.css'
        })
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginPost = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(400).render('errors/general', { 
                style:'style.css',
                error: `Invalid Credentials`
            })
        }

        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
            social: req.user.social,
            cart: req.user.cart,
            documents: req.user.documents,
            last_connection: req.user.last_connection
        }

        const updateUser = await UsersService.updateLastConnection(req.session.user._id)

        return res.cookie(config.COOKIE_NAME, req.user.token).redirect('/home');
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginGitHub = async (req, res) => {
    try {
        req.session.user = req.user;
        const updateUser = await UsersService.updateLastConnection(req.session.user._id)

        return res.status(200).redirect('/users/current');
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginGoogle = async (req, res) => {
    try {
        req.session.user = req.user;
        const updateUser = await UsersService.updateLastConnection(req.session.user._id)

        return res.status(200).redirect('/users/current');
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginApiPost = async (req, res) => {
    try {
        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
            social: req.user.social,
            cart: req.user.cart,
            documents: req.user.documents,
            last_connection: req.user.last_connection
        }

        return res.cookie(config.COOKIE_NAME, req.user.token).send({ status: 'success', message: 'Login API Success.'});
    } catch (error) {
        req.logger.error(`From loginApiPost: ${error.message}`);
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const registerApiPost = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400)
        }

        return res.status(200).send({ status: 'success', message: 'Register API Success.'});
    } catch (error) {
        req.logger.error(`From resgisterApiPost: ${error}`);
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const updateUser = UsersService.updateLastConnection(req.session.user._id)
        req.session.destroy(err => {
            if (err) {
                return res.status(500).render('errors/general', { 
                    style: 'style.css',
                    error: err 
                });
            }

    
            return res.status(200).clearCookie(config.COOKIE_NAME).redirect('/home');
        });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const errors = async (req, res) => {
    try {
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: 'Session Error, try again later' 
        });
    } catch (error) {
        req.logger.error(error.message)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const getReset = async (req, res) => {
    try {
        return res.status(200).render('users/resetPassword', {
            style: 'style.css'
        }); 
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const postReset = async (req, res) => {
    try {
        const userEmail = req.body.email
        
        const sendMail = await UsersService.sendResetMail(userEmail)

        const date = new Date();
        const currentDate = date.toLocaleString();
    
        return res.status(200).send({ status: 'success', message: `Mail sent at ${currentDate}. Check your inbox` })

    } catch (error) {
        req.logger.error(`Error un postReset: ${error}`)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const getResetLink = async(req, res) => {
    try {
        const uid = req.params.uid;
        const token = req.params.resetToken;

        const user = await UsersService.getById(uid);

        if(user === undefined) {
            CustomError.createError({
                name: 'Error in Users.Controller',
                cause: generateNotFoundError(uid),
                message: `User no encontrado, endpoint: ${req.url}.`,
                code: ERRORS.NOT_FOUND_ERROR
            })
            return res.status(401).redirect('users/resetPassword')
        }

        return res.status(200).render('users/newPassword', {
            style: 'style.css',
            userEmail: user.email,
            uid,
            token
        })

    } catch (error) {
        req.logger.error(`Error un getResetLink: ${error.message}`)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const postResetLink = async (req, res) => {
    try {
        const uid = req.params.uid;
        const token = req.params.token;
        if(token === undefined) {
            CustomError.createError({
                name: 'Error in postResetLink, User.Controller',
                cause: generateGeneralError(),
                message: 'The TOKEN has expired.',
                code: ERRORS.GENERAL_ERROR
            })
            res.redirect('users/login')
        }
        const password = req.body;

        const result = await UsersService.resetPassword(uid, token, password);

        return res.status(200).redirect("users/login");

    } catch (error) {
        req.logger.error(`Error un getResetLink: ${error.message}`)
        return res.status(400).send({ status: 'error', error: error });
    }
}

export const modifyRol = async (req, res) => {
    try {
        const uid = req.params.uid
        const user = await UsersService.getById(uid)
        if(user.rol === 'admin') {
            return res.status(403).send({ status: 'error', message: 'No se puede actulizar el rol del usuario' });
        }

        const newRol = await UsersService.modifyRol(uid)
        const updatedUser = await UsersService.getById(uid)

        return res.status(200).send({ status: 'success', payload: updatedUser });

    } catch (error) {
        CustomError.createError({
            name: 'catch in modifyRol, User.Controller',
            cause: generateGeneralError(),
            message: `Problema en UserController, endpoint: ${req.url}.`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).send({ status: 'error', error: error.message });
    }
}

export const uploadDocs = async (req, res) => {
    try {
        const { uid } = req.params

        const filesValues = Object.values(req.files)

        filesValues.map(async (files) => {
            return files.map(async (file) => {
                const newFiles = {
                name: file.originalname,
                reference: file.path,
                };
                await UsersService.uploadDocs(uid, newFiles);
    
                return;
            });
        });

        return res.status(200).send({ status: 'success', message: `File uploaded succesfully.` });
        
    } catch (error) {
        req.logger.error(error.message)
        return res.status(500).send({ status: 'error', error: error.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await UsersService.getUsers();

        const dataToShow = []
        users.forEach(u => {
            const user = {
                first_name: u.first_name,
                last_name: u.last_name,
                email: u.email,
                rol: u.rol,
                social: u.social,
                cart: u.cart,
                last_connection: u.last_connection
            }
            dataToShow.push(user)
        });
        
        return res.status(200).send({ status: 'succes', payload: dataToShow })
    } catch (error) {
        CustomError.createError({
            name: `User search error`,
            cause: generateGeneralError(error),
            message: `Problema en ApiUsers, endpoint: ${req.url}.`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).send({ status: 'error', error: error.message })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
            const user = req.session.user;
        
            if(!user) {
                return res.status(401).send({ status: 'error', error: 'User not logged in' });
            }
            const getUser = await UsersService.getUser(user.email)
            
            return res.send({ status: 'success', payload: getUser})
    } catch (error) {
        CustomError.createError({
            name: `User search error`,
            cause: generateGeneralError(error),
            message: `Problem in ApiUsers, endpoint: ${req.url}.`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).send({ status: 'error', error: error.message })
    }
}

export const deleteInactiveUsers = async(req, res) => {
    try {
        const session = req.session.user;
        if(!session) return res.status(400).send({ status: 'error', error: 'No user logged in' })
        
        const setHours = new Date();
        setHours.setHours(setHours.getHours() - 48);

        const result = await UsersService.deleteInactiveUsers(setHours)
        if(result.deletedCount === 0) {
            return res.status(200).send({ status: 'success', message: `All the users are recently active. No need to delete.`})
        }
        
        return res.status(200).send({ status: 'success', message: `${result.deletedCount} inactive users deleted.` })
    } catch (error) {
        CustomError.createError({
            name: `User search error`,
            cause: generateGeneralError(error),
            message: `Problem in ApiUsers, endpoint: ${req.url}.`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).send({ status: 'error', error: error.message })
    }
}