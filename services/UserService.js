import User from '../models/user.js'
import bcrypt from 'bcrypt'
import userDto from "../dto/userDto.js";
import TokenService from "./tokenService.js";
export default class UserService {
    static async createUser(user, res) {
        try{
            const {username, nickname, password, confirm} = user
            const sameUser = await User.findOne({username})
            if (!sameUser){
                if (password !== confirm) {
                    res.status(400).send("Passwords are not same")
                    return
                }
                const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())
                const user =  await User.create({username, nickname, password: hashedPassword})
                const {accessToken, refreshToken} = await TokenService.generateTokens(user)
                user.sessions.push({accessToken, refreshToken})
                await user.save()
                res.set('accessToken', accessToken);
                res.set('refreshToken', refreshToken);
                res.status(200).json(new userDto(user))
            }
            else {
                res.status(409).send("User already exists")
            }
        }catch (e) {
            console.error(e)
        }
    }

    static async logUser(user, res) {
        try{
            const {username, password} = user
            const sameUser = await User.findOne({username})
            if (sameUser){
                const isPasswordCorrect = await bcrypt.compare(password, sameUser.password)
                if (isPasswordCorrect){
                    const {accessToken, refreshToken} = await TokenService.generateTokens(user)
                    sameUser.sessions.push({accessToken, refreshToken})
                    await sameUser.save()
                    res.set('accessToken', accessToken);
                    res.set('refreshToken', refreshToken);
                    res.status(200).json(new userDto(user))
                }
                else {
                    res.status(404).send("Wrong data or user doesn't exist")
                }
            }
            else {
                res.status(404).send("Wrong data or user doesn't exist")
            }
        }catch (e) {
            console.error(e)
        }
    }
}