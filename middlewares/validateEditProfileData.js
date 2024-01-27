import { check, validationResult } from 'express-validator';

export const validateEditProfileData = async (req, res, next) => {
    try {
        await Promise.all([
            check('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
                .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain only alphanumeric characters').run(req),
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(errors.array()[0].msg);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
