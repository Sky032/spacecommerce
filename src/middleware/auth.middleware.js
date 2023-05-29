const isAuthenticated = (req, res, next) => {
    if (req.session?.user) {
        return next();
    }

    return res.render('errors/general', {
        style: 'style.css', 
        error: 'Please login first.'
    });
}

const currentUser = (req, res, next) => {
    if (req.session?.user) {
        return next();
    }

    return res.status(401).send({ status: 'error', error: `Not logged in.` })
}

export const AuthMiddleware = { isAuthenticated, currentUser };