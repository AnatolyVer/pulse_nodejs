import jwt from "jsonwebtoken";
import User from "../models/user.js";
import tokenService from "../services/tokenService.js";

export const validateTokens = async (req, res, next) => {
    try {
        const accessToken = req.headers['access-token'];
        const refreshToken = req.headers['refresh-token'];

        if (accessToken === undefined || refreshToken === undefined) {
            console.log("no tokens")
            return res.status(401).send("Log in again");
        }

        try {
            jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
        }
        catch (accessTokenError) {
            try {
                jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                const {_id}  = jwt.decode(refreshToken)
                const user = await User.findById(_id);
                if (user){
                    const index = user.sessions.findIndex(session => session.accessToken === accessToken && session.refreshToken === refreshToken)

                    const tokens = await tokenService.generateTokens(user)

                    user.sessions.splice(index, 1);
                    await user.save()

                    user.sessions.push({
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken
                    })

                    await user.save()

                    res.setHeader('refresh-token', tokens.refreshToken);
                    res.setHeader('access-token', tokens.accessToken);
                    return res.status(403).send("Repeat the request");
                }

                console.log("no user")

                return res.status(401).send("Login again");

            } catch (refreshTokenError) {
                console.log("bad rt")
                console.error(refreshTokenError)
                return res.status(401).send("Login again");
            }
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).send("Log in again");
    }
}
