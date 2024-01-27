import userService from '../services/UserService.js'
import jwt from "jsonwebtoken";

export default class UserController {


    //refactored
    static async signUp(req, res) {
        try{
            const user = req.body
            const {accessToken, refreshToken, _id} = await userService.createUser(user)
            res.setHeader('access-token', accessToken);
            res.setHeader('refresh-token', refreshToken);
            res.status(200).json(_id)
        }catch (e) {
            console.error(e);
            res.status(500).end(e.message)
        }
        return res
    }

    static async signIn(req, res) {
        try{
            const user = req.body
            const {accessToken, refreshToken, _id} = await userService.logUser(user, res)
            res.setHeader('access-token', accessToken);
            res.setHeader('refresh-token', refreshToken);
            res.status(200).json(_id)
        }catch (e) {
            console.error(e);
            res.status(500).end(e.message)
        }
        return res
    }

    static async getUser(req, res) {
        try{
            const {id} = req.params
            const user = await userService.getUser(id)
            res.status(200).json(user)
        }catch (e) {
            res.status(500).send(e.message)
        }
        return res
    }

    static async logOut(req, res) {
        try{
            await userService.logOut(req, res)
        }catch (e) {
            console.error(e);
            res.status(500).send(e.message)
        }
        return res
    }

    static async updateUser(req, res) {
        try{
            const user = req.body
            const {_id} = jwt.decode(req.headers['refresh-token'])
            await userService.updateUser(user, _id, res)
        }catch (e) {
            console.error(e);
            res.status(500).send(e.message)
        }
        return res
    }

    static async setAvatar(req, res){
        try {
            const avatar = req.file;
            const {username} = jwt.decode(req.headers['access-token'])
            const fileName = username + '_' + 'avatar';
            const url = await userService.setAvatar(avatar, fileName)
            res.status(200).send(url)
        } catch (err) {
            console.error(err);
            res.status(404).send(err)
        }
        return res
    }
}