import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const validateTokens = async (req, res, next) => {
    try {
        const accessToken = req.headers['access-token'];
        const refreshToken = req.headers['refresh-token'];

        if (!accessToken || !refreshToken) {
            return res.status(401).send("Log in again");
        }

        try {
            jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
        }
        catch (accessTokenError) {
            if (accessTokenError.name === 'TokenExpiredError') {
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

                    const user = await User.findOneAndUpdate(
                        {
                            sessions: {
                                $elemMatch: {
                                    access_token: accessToken,
                                    refresh_token: refreshToken
                                }
                            }
                        },
                        {
                            $set: {
                                "sessions.$.access_token": decodedRefreshToken.newAccessToken
                            }
                        }
                    );

                    if (!user) {
                        return res.status(401).send("Log in again");
                    }

                    req.headers['access-token'] = decodedRefreshToken.newAccessToken;
                } catch (refreshTokenError) {
                    return res.status(401).send("Log in again");
                }
            } else {
                return res.status(401).send("Log in again");
            }
        }

        next();
    } catch (error) {
        return res.status(401).send("Log in again");
    }
}
