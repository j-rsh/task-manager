// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/server-utils/database'
import { User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse<User | { message: string }>) {
    clearTokenFromCookie(req, res);
    return res.end();
}

const clearTokenFromCookie = (req: NextApiRequest, res: NextApiResponse) => {
    // create a token
    const token = crypto.randomUUID();

    // Create a cookies instance
    const cookies = new Cookies(req, res);

    // delete cookie
    cookies.set('token');

}