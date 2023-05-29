import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config.js';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const validatePassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}


// Config JWT
export const generateToken = (user) => {
    const token = jwt.sign({ user }, config.PRIVATE_KEY, { expiresIn: '24h' })

    return token
}

export const generateResetPasswordToken = (user) => {
    const resetToken = jwt.sign({ id: user._id }, config.JWT_PASS_TOKEN, { expiresIn: '1h' });
    // user.update({
    //     tokenResetPassword: resetToken
    // })
    
    return resetToken
}

export const authToken = (req, res, next) => {
    const authToken = req.cookies.config.COOKIE_NAME

    if(!authToken) {
        return res.status(401).render('errors/general', {
            style: 'style.css',
            error: 'No Authentication.'
        });
    }

    jwt.verify(token, config.PRIVATE_KEY, (error, credentials) => {
        if(error) {
            return res.status(403).render('errors/general', {
                style: 'style.css',
                error: 'No Authorization.'
            })
        }
        req.user = credentials.user;
        next();
    })
}

export const authPolicies = (rol1, rol2) => (req, res, next) => {
    if(!req.session.user) {
        return res.status(401).send({ status: 'error', error: "User Not Loged In" });
    }
    
    const rol = req.session.user.rol;

    if (typeof rol1 === "undefined") {
        rol1 = rol2;
        rol2 = null;
    }
    
    if (rol !== rol1 && rol !== rol2){
        return res.status(403).render('errors/general', { 
            style: 'style.css',
            error: "User Not Authorized - Rol Check Failed" 
        });
    }
    next();
};

export const passportCall = (strategyName) => {
    return async(req, res, next) => {
        passport.authenticate(strategyName, function(err, user, info) {
            if(err) {
                return res.status(401).render('errors/general', {
                    style: 'style.css',
                    error: info.message ? info.message : info.toString()
                });
            }

            req.user = user
            next();
        })(req, res, next)
    }
}
