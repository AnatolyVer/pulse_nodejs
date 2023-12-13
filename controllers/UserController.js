import userService from '../services/UserService.js'

export default class UserController {

    static async signUp(req, res) {
        try{
            const user = req.body
            await userService.createUser(user, res)
        }catch (e) {
            res.status(500).end()
        }
        return res
    }

    static async signIn(req, res) {
        try{
            const user = req.body
            await userService.logUser(user, res)
        }catch (e) {
            res.status(500).end()
        }
        return res
    }
}