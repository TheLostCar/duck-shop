import type { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import Duck, { DuckSchemaType, LeanDuckSchemaType } from '../../models/Duck';
import dbConnect from '../../lib/dbConnect';
import mongoose, { LeanDocument, Query } from 'mongoose';
import formidable from 'formidable';
import { getToken } from 'next-auth/jwt';

type Data = {
    message: any,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await dbConnect();
    switch (req.method) {
        case "POST":
            try {
                const token = await getToken({ req })
                if (!token?.user) throw new Error('Invalid Credentials');
                if (token.user.isAdmin !== true) throw new Error('Not an admin')

                const form = new formidable.IncomingForm({
                    multiples: true
                });
                const { _id, newIndex, name, description, price } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(function (resolve, reject) {
                    form.parse(req, (err, fields, files) => {
                        if (err) return reject(err);
                        resolve({ fields, files });
                    });
                })
                    .then(({ fields, files }) => {
                        if (typeof fields._id !== 'string' || !fields.name) throw new Error('_id of duck required');
                        if (typeof fields.name !== 'string' || !fields.name) throw new TypeError('Duck must have name');
                        if (typeof fields.description !== 'string' || !fields.description) throw new TypeError('Duck must have description');
                        if (typeof fields.price !== 'string' || !fields.price) throw new TypeError('Duck must have price');
                        if (/^[0-9]{0,7}\.[0-9][0-9]$/.test(fields.price) === false) throw new TypeError('Invalid price format')


                        if (typeof fields.newIndex !== 'string' || !fields.newIndex) throw new Error('NewIndex must be JSON string');
                        fields.newIndex = JSON.parse(fields.newIndex)
                        if (!(fields.newIndex instanceof Array)) throw new TypeError('Index Array missing')


                        // files.images.forEach((v, i) => {
                        //     if (v.originalFilename === null) throw TypeError('Missing original file name')
                        //     if (!/\.(jpe?g|png)$/i.test(v.originalFilename)) throw TypeError('Invalid file type')
                        // })

                        // returning object allows deconstruction and maintains types from above checks
                        return { _id: fields._id, newIndex: fields.newIndex, name: fields.name, description: fields.description, price: fields.price };
                    })
                    .catch(error => { throw error });


                const duck: LeanDuckSchemaType = await Duck.findById(_id).lean()
                const images = newIndex.map((v, i) => duck.images[parseInt(v)])


                const update = {
                    name,
                    description,
                    price,
                    images,
                }
                const updateOptions = {
                    new: true,
                    lean: true,
                    runValidators: true,
                }

                await Duck.findByIdAndUpdate(_id, update, updateOptions);

                res.status(200).json({ message: 'Updated Successfully' });
            } catch (e: any) {
                res.status(400).json({ message: e.message });
            }
            break;
        default:
            res.status(400).json({ message: "Method not supported" });
    }
}

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};
