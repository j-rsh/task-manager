import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from './database';

export default async function authenticatedMiddleware(req: NextApiRequest, res: NextApiResponse) {
    const authorizationHeader = req.headers.authorization || '';
    const bearer = authorizationHeader?.split(' ')[1];

    if (!bearer) {
        res.status(403).json({ errors: "Access denied" })
    }

    const user = await prisma.user.findFirst({
        where: {
            token: bearer
        }
    });

    if (!user) {
        res.status(403).json({ errors: "Access denied" })
    }

    return user;
}
