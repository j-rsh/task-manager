import authenticatedMiddleware from '@/server-utils/authenticated-middleware'

import { createTodoHandler } from '@/server-utils/todos/create-todo-handler';
import { deleteTodoHandler } from '@/server-utils/todos/delete-todo-handler';
import { todoDetailHandler } from '@/server-utils/todos/todo-details-handler';
import { todoListHandler } from '@/server-utils/todos/todo-list-handler';
import { updateTodoHandler } from '@/server-utils/todos/update-todo-handler';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = await authenticatedMiddleware(req, res);

    switch (req.method) {
        case 'GET':
            return todoDetailHandler(req, res, user!);

        case 'PUT':
            return updateTodoHandler(req, res, user!);

        case 'DELETE':
            return deleteTodoHandler(req, res, user!);

        default:
            return res.status(405).json({ message: 'Method not allowed' });

    }


}

