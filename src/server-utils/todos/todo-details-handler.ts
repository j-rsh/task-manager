
import { Todo, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const todoDetailHandler = async (req: NextApiRequest, res: NextApiResponse<Todo | { message: string }>, user: User) => {
    const id = req.query.id;
    try {
        const todo = await prisma.todo.findFirst({
            where: {
                userId: user?.id,
                id: +id! // convert string and undefined to number
            }
        });
        if (todo) {
            return res.json(todo);
        }
        return res.status(404).json({ message: "Todo not found" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
