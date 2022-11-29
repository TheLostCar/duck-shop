import type { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import Duck, { DuckSchemaType, LeanDuckSchemaType } from '../../models/Duck';
import dbConnect from '../../lib/dbConnect';
import { LeanDocument } from 'mongoose';

type Data = {
    duck?: any,
    err?: any
}
const callback = (obj: LeanDocument<DuckSchemaType>) => {
    return Object.assign(obj, { _id: obj._id.toString(), price: obj.price.toString() })
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await dbConnect();
    switch (req.method) {
        case "POST":
            try {
                const duck = await Duck.findById(req.body._id)
                    .lean()
                    .select('-__v -createdAt -updatedAt')
                    .then(callback)
                res.status(200).json({ duck })
            } catch (e: any) {
                res.status(400).json({ err: e.message })
            }
            break;
        default:
            res.status(400).json({ err: 'Method not supported' });
    }
}
