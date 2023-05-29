import { Router } from 'express';
import { addProduct, createCart, deleteProduct, emptyCart, getCartById, getCarts, purchase } from '../controllers/carts.controller.js';
import { authPolicies } from '../utils/utils.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();


router.get('/', getCarts)
router.post('/', authPolicies('admin'), createCart)
router.get('/:cid', AuthMiddleware.isAuthenticated, getCartById)
router.delete('/:cid', AuthMiddleware.isAuthenticated, emptyCart)
router.post('/:cid/products/:pid', AuthMiddleware.isAuthenticated, addProduct)
router.delete('/:cid/products/:pid', authPolicies('admin', 'premium'), deleteProduct)
router.post('/:cid/purchase', AuthMiddleware.isAuthenticated, purchase)



export default router;