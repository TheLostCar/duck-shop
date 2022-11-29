import type { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import Duck, { DuckSchemaType, LeanDuckSchemaType } from '@models/Duck';
import { LeanDocument } from 'mongoose';
import dbConnect from '@lib/dbConnect'

type Data = {
    ducks?: any,
    err?: any
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

                const ducks = await Duck.find(skip)
                    .lean()
                    .sort({ _id: -1 })
                    .limit(2)
                    .select('-__v')
                    .then(callback)

                res.status(200).json({ ducks })
            } catch (e: any) {
                res.status(400).json({ err: e.message })
            }
            break;
        default:
            res.status(400).json({ err: 'Method not supported' })
    }
}