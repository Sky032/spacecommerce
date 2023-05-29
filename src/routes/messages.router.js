import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import Messages from '../dao/mongo/message.mongo.js';
import { authPolicies } from '../utils/utils.js';

const messageService = new Messages()

const router = Router();

router.get('/', AuthMiddleware.isAuthenticated, authPolicies('user', 'premium'), async (req, res) => {
    const user = req.session.user;
    const message = await messageService.get()

    return res.render('users/chat', {
        style: 'style.css',
        user,
        message
    })
})

export default router;