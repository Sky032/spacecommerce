import { Router } from 'express';
import { addNewProdGet, addNewProdPost, cartById, getProducts, home, productDetails, updateInfo, userAccount, payment, paymentGet} from '../controllers/views.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { authPolicies } from '../utils/utils.js';


const router = Router();

// GET to homepage
router.get('/home', home)

// GET w/paginate & query params
router.get('/products', getProducts);

// GET to add new product
router.get('/products/addNew', AuthMiddleware.isAuthenticated, addNewProdGet);

// POST to add new product
router.post('/products/addNew', AuthMiddleware.isAuthenticated, addNewProdPost);

// GET to product detail 
router.get('/products/:pid', productDetails);

// GET to Carts
router.get('/carts/:cid', AuthMiddleware.isAuthenticated, cartById);

// User Profile
router.get('/users/current', AuthMiddleware.isAuthenticated, userAccount)

// Purchase de compra
router.get('/carts/:cid/payment', AuthMiddleware.isAuthenticated, paymentGet)
router.post('/carts/:cid/payment', AuthMiddleware.isAuthenticated, payment)


// Update user info
router.get('/users/updateInfo', AuthMiddleware.isAuthenticated, async(req, res) => {
    const user = req.session.user;
    const isAdmin = user.rol === 'admin' || user.rol === 'premium';

    res.render('users/updateInfo', {
        style: 'style.css',
        user,
        isAdmin
    })
})

router.post('/users/updateInfo', AuthMiddleware.isAuthenticated, updateInfo)

export default router