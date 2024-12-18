import { login, register } from '../services/users.service.js';

import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import { env } from "../config.js";

import { loginUser, registerUser } from "../schemas/users.schema.js";
import { cleanBody } from "../middlewares/cleaner.middleware.js"
const router = Router();


router.post('/login', cleanBody, expressYupMiddleware({ schemaValidator: loginUser }), async (req, res) => {
    const { username, password } = req.body;
    const loginRequest = await login({ username, password });
    if(loginRequest.status == 200) {
        res.cookie('token',  loginRequest.data.token, { httpOnly: true, secure: true, domain: env.COOKIE_DOMAIN, sameSite: 'strict' })
    }
    return res.status(loginRequest.status).json({ data: loginRequest.data, error: loginRequest.error })
})


router.post('/register', cleanBody, expressYupMiddleware({ schemaValidator: registerUser }), async (req, res) => {
    const { username, password, name, password_again } = req.body;
    const registerRequest = await register({ username, password, password_again, name });
    return res.status(registerRequest.status).json({ data: registerRequest.data, error: registerRequest.error })
})

export default router;