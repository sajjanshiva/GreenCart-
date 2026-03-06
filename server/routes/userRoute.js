import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const userRouter = express.Router();

userRouter.post('/register', authLimiter, register);
userRouter.post('/login', authLimiter, login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get("/logout", authUser, logout);

export default userRouter;