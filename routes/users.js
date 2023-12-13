import { Router } from "express";

import UserController from "../controllers/UserController.js";
import {validateTokens} from "../middlewares/validateTokens.js";

const userRouter = Router()

userRouter.get('/:id', validateTokens, UserController.getUser)

userRouter.post('/sign_up', UserController.signUp)
userRouter.post('/sign_in', UserController.signIn)

userRouter.delete("/log_out", validateTokens, UserController.logOut)

export default userRouter
