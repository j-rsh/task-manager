// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/server-utils/database'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: "Provide username and password" });
    }

    const user = await prisma.user.findFirst({
        where: {
            username: username as string,
            password: password as string
        },
        select: { username: true, name: true, id: true }
    })

    if (user != null) {
        // create a simple token
        const token = setTokenInCookie(req, res);

        // save token in database
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                token,
            },
        })

        return res.json({ ...user, token });
    }
    return res.status(401).json({ message: "Unauthorized" });

}

const setTokenInCookie = (req: NextApiRequest, res: NextApiResponse) => {
    // create a token
    const token = crypto.randomUUID();

    // Create a cookies instance
    const cookies = new Cookies(req, res);

    // Set in cookie
    cookies.set('token', token);

    return token;
}