import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import postsSchema from "../schemas/posts.schema.js";
import postsService from "../services/posts.service.js";
import { cleanBody, cleanParams, cleanQuery } from "../middlewares/cleaner.middleware.js";
import { defaultLimitNPage } from "../middlewares/defaultValues.middleware.js";


const router = Router();

//GET /api/posts
router.get('/', cleanQuery, defaultLimitNPage, expressYupMiddleware({ schemaValidator: postsSchema.listsPosts }), async (req, res) => {
    //const { limit } = req.query;
    const query = req.query;
    const postsResponse = await postsService.getAll(query)
    return res.status(postsResponse.status).json({ data: postsResponse.data, error: postsResponse.error });
});

//GET /api/posts/user/:userId
router.get('/user/:userId', cleanParams, expressYupMiddleware({ schemaValidator: postsSchema.userPosts }), async (req, res) => {
    const { userId } = req.params;
    const getUserPostsResponse = await postsService.getUserPosts({ userId })
    return res.status(getUserPostsResponse.status).json({ data: getUserPostsResponse.data, error: getUserPostsResponse.error });
});

//GET /api/posts/:id
router.get('/:id', cleanParams, expressYupMiddleware({ schemaValidator: postsSchema.getPost }), async (req, res) => {
    const { id } = req.params;
    const getPostResponse = await postsService.get({ id })
    return res.status(getPostResponse.status).json({ data: getPostResponse.data, error: getPostResponse.error });
});



//POST /api/posts
router.post('/', cleanBody, expressYupMiddleware({ schemaValidator: postsSchema.addPost }), async (req, res) => {
    const { title, content, authorId, tags } = req.body;
    
    const addPostResponse = await postsService.add({ title, content, authorId: authorId  ?? (req.user.id), tags })
    return res.status(addPostResponse.status).json({ data: addPostResponse.data, error: addPostResponse.error });
});



//PUT /api/posts/:id
router.put('/:id', cleanParams, cleanBody, expressYupMiddleware({ schemaValidator: postsSchema.editPost }), async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const editPostResponse = await postsService.update({ id }, {...body, authorId: req.body?.authorId  ?? (req.user.id)})
    return res.status(editPostResponse.status).json({ data: editPostResponse.data, error: editPostResponse.error });
});

//DELETE /api/posts/:id
router.delete('/:id', cleanParams, expressYupMiddleware({ schemaValidator: postsSchema.deletePost }), async (req, res) => {
    const { id } = req.params;
    const deletePostResponse = await postsService.deletePost({ id })
    return res.status(deletePostResponse.status).json({ data: deletePostResponse.data, error: deletePostResponse.error });
});
export default router;