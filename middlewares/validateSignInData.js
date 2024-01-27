import { check, validationResult } from 'express-validator';

import User from "../models/user.js";
import bcrypt from "bcrypt";

export const validateSignInData = async (req, res, next) => {
    try {
        await Promise.all([
            check('username').notEmpty().withMessage('Username is required').run(req),
            check('password').notEmpty().withMessage('Password is required').run(req),
        ]);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).send(errors.array()[0].msg);
        }

        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(409).send("Wrong data or user doesn't exists");
        const {password} = user
        const isPasswordCorrect = await bcrypt.compare(req.body.password, password)
        if (!isPasswordCorrect) return res.status(409).send("Wrong data or user doesn't exists");

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
