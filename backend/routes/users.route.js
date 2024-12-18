import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import { getUser, getUserByUsername } from "../services/users.service.js";
import { cleanParams } from "../middlewares/cleaner.middleware.js";
import { getUser as getUserSchema, getUserByUsername as getUserByUsernameSchema } from "../schemas/users.schema.js";
import httpStatusCodes from "http-status-codes";


const router = Router();

//GET /api/posts
router.get('/me', async (req, res) => {
    //const { limit } = req.query;
    const user = req.user;
    return res.status(200).json({ data: { _id: user.id, ...user }, error: null });
});

router.get('/getByUserName/:username', cleanParams, expressYupMiddleware({ schemaValidator: getUserByUsernameSchema }), async (req, res) => {
    //const { limit } = req.query;
    const username = req.params.username;
    const userResponse = await getUserByUsername(username)
    return res.status(userResponse.status).json({ data: userResponse.data, error: userResponse.error });
});

router.get('/:userId', cleanParams, expressYupMiddleware({ schemaValidator: getUserSchema }), async (req, res) => {
    //const { limit } = req.query;
    const id = req.params.userId;

    const userResponse = await getUser(id)
    return res.status(userResponse.status).json({ data: userResponse.data, error: userResponse.error });
});

router.post('/logout', async (req, res) => {
    //const { limit } = req.query;
    res.clearCookie("token")
    return res.status(httpStatusCodes.OK).json({});
});
export default router;