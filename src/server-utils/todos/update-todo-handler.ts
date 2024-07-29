
import { Todo, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validateMiddleware from "../validator-middleware";
import { check } from "express-validator";

export const updateTodoHandler = async (req: NextApiRequest, res: NextApiResponse<Todo | { message: string }>, user: User) => {
    await validateBody(req, res);
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

        const todo = await prisma.todo.update({
            where: {
                userId: user?.id,
                id: +id! // convert string and undefined to number
            },
            data: {
                ...req.body
            }
        });
        return res.json(todo);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const validateBody = validateMiddleware([
    check('title')
        .optional(),

    check('description')
        .optional()
        .isLength({ min: 5 }).withMessage('Minimum length for description is 5'),

    check('category')
        .optional(),

    check('status')
        .optional()
        .isIn(["TODO", "DOING", "DONE"]).withMessage("Status must be one of TODO, DOING, DONE"),

    check('archived')
        .optional()
        .isBoolean().withMessage('Archived must be boolean'),

])
