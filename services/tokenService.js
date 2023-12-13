import jwt from 'jsonwebtoken'

export default class TokenService{

    static async generateTokens(user){
        const {_id} = user
        try {
            const accessToken = jwt.sign({_id}, process.env.ACCESS_SECRET_KEY, {expiresIn: '5m'})
            const refreshToken = jwt.sign({_id}, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'})
            return {accessToken, refreshToken}
        }catch (e){
            throw new Error(e.message)
        }
    }
}