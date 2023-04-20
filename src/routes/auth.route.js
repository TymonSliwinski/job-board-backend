import { Router } from "express";
import passport from "passport";
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.get('/login/google', passport.authenticate('google', { scope: ['email'] }));

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    res.redirect('/');
});

router.get('/refresh', AuthController.refreshToken);

export default router;
