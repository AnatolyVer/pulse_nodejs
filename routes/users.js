import { Router } from "express";

import UserController from "../controllers/UserController.js";

const userRouter = Router()

userRouter.post('/sign_up', UserController.signUp)
userRouter.post('/sign_in', UserController.signIn)
export default userRouter
