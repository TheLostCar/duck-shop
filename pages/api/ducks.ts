import type { NextApiRequest, NextApiResponse } from 'next'
import Duck, { DuckSchemaType } from '@models/Duck';
import dbConnect from '@lib/dbConnect';
import { LeanDocument } from 'mongoose';

type Data = {
    ducks?: any,
    message?: any
}
const callback = (res: LeanDocument<DuckSchemaType>[]) => {
    return res.map((obj) => Object.assign(obj, { _id: obj._id.toString(), price: obj.price.toString(), createdAt: new Date(obj.createdAt + '').toDateString(), updatedAt: new Date(obj.updatedAt + '').toDateString() }))
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await dbConnect();
    switch (req.method) {
        case "POST":
            const skip = req.body._id && { "_id": { "$lt": req.body._id } } || {}
            try {
                const a = await Duck.find(skip)
                    .lean()
                    .sort({ _id: -1 })
                    .limit(2)
                    .select('-__v')
                    .then(callback);
                res.status(200).json({ ducks: a })
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
            break;
        default:
            res.status(400).json({ message: 'Method not supported' });
    }
}
