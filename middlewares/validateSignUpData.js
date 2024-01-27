import User from "../models/user.js";
import { check, validationResult } from 'express-validator';

export const validateSignUpData = async (req, res, next) => {
    try {
        await Promise.all([
            check('nickname').notEmpty().withMessage('Nickname is required').run(req),
            check('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters').isAlphanumeric().withMessage('Username must contain only alphanumeric characters').run(req),
            check('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').run(req),
            check('confirm').notEmpty().withMessage('Confirm is required').custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password and confirm password do not match');
                }
                return true;
            }).run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(errors.array()[0].msg);
        }

        const { username } = req.body;
        const sameUser = await User.findOne({ username });
        if (sameUser) return res.status(409).send("User already exists");

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
