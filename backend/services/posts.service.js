import Post from "../models/post.model.js";
import User from "../models/user.model.js";

import moment from "moment";

import httpStatusCodes from "http-status-codes";

const getAll = async (query) => {
    try {
        const { title, content, authorName, tags, createdAt, limit, page } = query;
        const filter = {}
        const $match = {}

        if (authorName) {
            $match['author.username'] = authorName;
        }
        if (title) {
            filter.title = $match['title'] = { $regex: title, $options: 'i' };
        }
        if (content) {
            filter.content = $match['content'] = { $regex: content, $options: 'i' }
        }
        if (tags) {
            filter.tags = $match['tags'] = { $in: tags.split(',') }
        }
        if (createdAt)  {
            filter.createdAt = $match['createdAt'] = { $gte : new Date(createdAt)}
        }


        let queryF = Post.aggregate([
            {
                $lookup: {
                    from: 'users', // The name of the User collection in MongoDB
                    localField: 'author', // Field from the Post model
                    foreignField: '_id', // Field from the User model
                    as: 'author', // Output array field for author details
                },
            },
            {
                $unwind: '$author', // Deconstruct the author array
            },
            {
                $match
            }
        ]);


        const resources = await queryF
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return { status: httpStatusCodes.OK, data: resources, error: null }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal Server Error', detail: err.message } }
    }
}

const getUserPosts = async (params) => {
    try {
        const { userId } = params;
        const filter = {}
        filter.author = userId;

        const author = await User.findById(userId)
        if (author) {
            const resources = await Post.find(filter)
                .sort({ createdAt: -1 });

            return { status: httpStatusCodes.OK, data: resources, error: null }
        }
        return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'Author not found' } }

    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal Server Error', detail: err.message } }
    }
}

const add = async (body) => {
    try {
        const { title, content, authorId, tags } = body;

        const author = await User.findById(authorId)
        if (author) {
            //delete author.password;
            const createdAt = moment().format()
            const post = new Post({ title, content, author, tags: tags || [], createdAt })
            const newPost = await post.save();
            return { status: httpStatusCodes.OK, data: { _id: newPost._id, title, content, tags, createdAt, author: { id: author.id, name: author.name, username: author.username } }, error: null }
        } else {
            return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'Author not found' } }
        }

    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal Server Error', detail: err.message } }
    }
}

const update = async (params, body) => {
    try {
        const { id } = params;
        const { title, content, authorId, tags } = body;

        const post = await Post.findById(id);
        const author = await User.findById(authorId)

        if (author && post) {
            post.title = title;
            post.content = content;
            post.author = author;
            post.tags = tags;
            await post.save();

            return { status: httpStatusCodes.OK, data: { _id: post._id, title, createdAt: post.createdAt, content, tags, author: { _id: author.id, name: author.name, username: author.username } }, error: null }
        } else {
            return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'Author or Post not found' } }
        }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal Server Error', detail: err.message } }
    }
}


const get = async (params) => {
    try {
        const { id } = params;

        const post = await Post.findById(id).populate({
            path: 'author',  // The field to populate
            select: '_id name username', // Include only the name and username
            //match: { name: authorName }  // Only populate if the author's name matches
        }
        ).sort({ createdAt: -1 });

        if (post) {
            return { status: httpStatusCodes.OK, data: post, error: null }
        }

        return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'Post not found' } }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal Server Error', detail: err.message } }
    }
}


const deletePost = async (params) => {
    try {
        const { id } = params;
        const post = await Post.findById(id)
            .sort({ createdAt: -1 });

        if (post) {
            await post.deleteOne();
            return { status: httpStatusCodes.OK, data: { msg: 'Delete OK' }, error: null }
        }

        return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'Post not found' } }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal Server Error', detail: err.message } }
    }
}

export default { getAll, getUserPosts, add, update, get, deletePost }