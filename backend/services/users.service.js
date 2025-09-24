import User from "../models/user.model.js";
import httpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "../config.js";

const login = async ({ username, password }) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'User not found' } }
        }

        const compareOp = await new Promise(async (resolve) => {

            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    resolve({ status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal server error at crypograpy service', detail: new Error(err) } })
                }
                if (!isMatch) {
                    resolve({ status: httpStatusCodes.BAD_REQUEST, data: null, error: { msg: 'Credential error' } })
                }
                const payload = { id: user._id, name: user.name, username: user.username };
                const token = jwt.sign(payload, env.JWT_SECRET);

                resolve({ status: httpStatusCodes.OK, data: { token, user: payload }, error: null })
            })
        })
        return compareOp;
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal server error', detail: new Error(err) } }
    }
}

const register = async ({ username, password, password_again, name }) => {
    try {
        const user = await User.findOne({ username });
        if (user) {
            return { status: httpStatusCodes.CONFLICT, data: null, error: { msg: 'User alredy exist' } }
        }

        if (password != password_again) {
            return { status: httpStatusCodes.BAD_REQUEST, data: null, error: { msg: 'Password must be the same' } }
        }
        const newRecord = new User({
            username,
            password,
            name,
            //role: 'user'
        })
        await newRecord.save();

        return { status: httpStatusCodes.CREATED, data: { redirect: '/auth/login' }, error: null }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null, error: { msg: 'Internal server error', detail: err.message } }
    }
}


const getUser = async (id) => {
    try {
        
        const user = await User.findOne({ _id: id });
        
        if(user) {
            return { status: httpStatusCodes.OK, data: { _id: user.id, username: user.username, name: user.name}, error: null }
        }
        return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'User not Found'} }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null,  error: { msg: 'Internal server error', detail: err.message } }
    }
}

const getUserByUsername = async (username) => {
    try {
        
        const user = await User.findOne({ username: username });
        
        if(user) {
            return { status: httpStatusCodes.OK, data: { _id: user.id, username: user.username, name: user.name}, error: null }
        }
        return { status: httpStatusCodes.NOT_FOUND, data: null, error: { msg: 'User not Found'} }
    } catch (err) {
        return { status: httpStatusCodes.INTERNAL_SERVER_ERROR, data: null,  error: { msg: 'Internal server error', detail: err.message } }
    }
}

export { login, register, getUser, getUserByUsername }