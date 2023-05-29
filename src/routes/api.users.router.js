import { Router } from 'express';
import { deleteInactiveUsers, getAllUsers, getCurrentUser, loginApiPost, modifyRol, registerApiPost, uploadDocs } from '../controllers/users.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { authPolicies } from '../utils/utils.js';
import upload from '../utils/multer.js';
import passport from 'passport';


const router = Router();


router.get('/', getAllUsers)

router.get('/current', AuthMiddleware.currentUser, getCurrentUser)

router.get("/premium/:uid", modifyRol);

router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'products', maxCount: 1 },
    { name: 'documents', maxCount: 1 },
]), uploadDocs);

router.get('/deleteInactiveUsers', authPolicies('admin'), deleteInactiveUsers)

// Router for Testing Register & Login
router.post('/register', passport.authenticate('register', { failureRedirect: '/users/error' }), registerApiPost);

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/error' }), loginApiPost)

export default router;