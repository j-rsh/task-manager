import { validationResult } from 'express-validator'
import { NextApiRequest, NextApiResponse } from 'next'

export default function validateMiddleware(validations: any[]) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        await Promise.all(validations.map((validation) => validation.run(req)))
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() })
        }
    }
}
