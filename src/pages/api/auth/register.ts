// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/server-utils/database'
import { User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { check } from 'express-validator'
import validateMiddleware from '@/server-utils/validator-middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse<User | { message: string }>) {
    const { username, password, name } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await validateBody(req, res);

    if (!username || !password) {
        return res.status(400).json({ message: "Provide username and password" });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password,
            }
        });
        return res.status(200).json({ message: "You Are registered successfully" });
    } catch (e) {
        console.log(e);
    }
    return res.status(500).json({ message: "Internal Server Error" });
}

const validateBody = validateMiddleware([
    check('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 40 }).withMessage('Provide a valid username')
        .custom(async (username) => {
            const user = await prisma.user.findFirst({
                where: {
                    username: username as string
                }
            })
            if (user != null) {
                throw new Error('Username already exists')
            }
        }),

    check('name')
        .optional()
        .isLength({ min: 3, max: 100 }).withMessage('Provide a valid name'),

    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 40 }).withMessage('Provide a valid Password'),

    check('confirmPassword')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true;
        }),
])

