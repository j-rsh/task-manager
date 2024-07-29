import { Todo, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validateMiddleware from "../validator-middleware";
import { check } from "express-validator";

export const createTodoHandler = async (req: NextApiRequest, res: NextApiResponse<Todo | { message: string }>, user: User) => {
    await validateBody(req, res);

    const { title, description, category } = req.body;

    try {
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                category,
                userId: user.id
            }
        });
        return res.status(201).json(todo);
    } catch (e) {
        console.log(e);
    }
    return res.status(500).json({ message: "Internal Server Error" });
}

const validateBody = validateMiddleware([
    check('title')
        .notEmpty().withMessage('Title is required'),

    check('description')
        .optional()
        .isLength({ min: 5 }).withMessage('Minimum length for description is 5'),

    check('category')
        .optional(),

])