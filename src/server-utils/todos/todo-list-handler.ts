import { Todo, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const todoListHandler = async (req: NextApiRequest, res: NextApiResponse<Todo[]>, user: User) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: user?.id
        }
    });
    return res.json(todos);
}
