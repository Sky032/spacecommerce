import { Router } from 'express';
import passport from 'passport';
import { errors, getReset, getResetLink, loginGet, loginGitHub, loginGoogle, loginPost, logout, postReset, postResetLink, registerGet, registerPost } from '../controllers/users.controller.js';

const router = Router();

router.get('/register', registerGet);
router.post('/register', passport.authenticate('register', { failureRedirect: '/users/error' }), registerPost);

router.get('/login', loginGet)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/error' }), loginPost);

router.get('/login-github', passport.authenticate('github', { scope: [ 'user: email' ]}), async(req, res) => { });
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/users/error'}), loginGitHub);

router.get('/login-google', passport.authenticate('google', {scope: ['email', 'profile']}), (req, res) => {})
router.get('/google-callback', passport.authenticate('google', { failureRedirect: '/users/error'}), loginGoogle);

router.get('/resetPassword', getReset)
router.post('/resetPassword', postReset)

router.get('/resetLink/:uid/:resetToken', getResetLink);
router.post('/resetLink/:uid/:token', postResetLink);

router.get('/logout', logout);

router.get('/error', errors);




export default router;