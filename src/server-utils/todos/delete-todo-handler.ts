
import { Todo, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const deleteTodoHandler = async (req: NextApiRequest, res: NextApiResponse<Todo | { message: string }>, user: User) => {
    const { id } = req.query;

    try {
        const check = await prisma.todo.findFirst({
            where: {
                userId: user?.id,
                id: +id! // convert string and undefined to number
            },
        });
        if (!check) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const deleteTodo = await prisma.todo.delete({
            where: {
                userId: user?.id,
                id: +id! // convert string and undefined to number
            },
        });
        return res.end();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

