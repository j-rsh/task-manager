import authenticatedMiddleware from '@/server-utils/authenticated-middleware'
import { createTodoHandler } from '@/server-utils/todos/create-todo-handler';
import { todoListHandler } from '@/server-utils/todos/todo-list-handler';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = await authenticatedMiddleware(req, res);

  switch (req.method) {
    case 'GET':
      return todoListHandler(req, res, user!);

    case 'POST':
      return createTodoHandler(req, res, user!);

    default:
      return res.status(405).json({ message: 'Method not allowed' });

  }


}

