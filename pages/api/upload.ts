import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import Duck, { DuckSchemaType } from '@models/Duck';
import dbConnect from '@lib/dbConnect';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { HydratedDocument, Model } from 'mongoose';
import { getToken } from 'next-auth/jwt';

const CLOUDINARY_BASE_PATH = 'ducks/';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true

});



const formidableConfig: Partial<formidable.Options> = {
    maxFileSize: 20 * 1024 * 1024,
    maxFieldsSize: 20 * 1024 * 1024,
    allowEmptyFiles: false,
    multiples: true
};

const a = {
    multiples: true,
    maxFileSize: 10_000_000,
    maxFieldsSize: 10_000_000,
}

type Data = {
    message?: any
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await dbConnect();

    switch (req.method) {
        case 'POST':
            const form = new formidable.IncomingForm(formidableConfig);

            try {
                const token = await getToken({ req })
                if (!token?.user) throw new Error('Invalid Credentials');
                if (token.user.isAdmin !== true) throw new Error('Not an admin')


                const { images, name, description, price } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(function (resolve, reject) {
                    form.parse(req, (err, fields, files) => {
                        if (err) return reject(err);
                        resolve({ fields, files });
                    });
                })
                    .then(({ fields, files }) => {
                        if (typeof fields.name !== 'string' || !fields.name) throw new TypeError('Duck must have name');
                        if (typeof fields.description !== 'string' || !fields.description) throw new TypeError('Duck must have description');
                        if (typeof fields.price !== 'string' || !fields.price) throw new TypeError('Duck must have price');
                        if (/^[0-9]{0,7}\.[0-9][0-9]$/.test(fields.price) === false) throw new TypeError('Invalid price format')


                        if (files.images === undefined) throw new TypeError('Duck must have at least one image');
                        if (!(files.images instanceof Array)) files.images = [files.images];


                        files.images.forEach((v, i) => {
                            if (v.originalFilename === null) throw TypeError('Missing original file name')
                            if (!/\.(jpe?g|png)$/i.test(v.originalFilename)) throw TypeError('Invalid file type')
                        })

                        // returning object allows deconstruction and maintains types from above checks
                        return { images: files.images, name: fields.name, description: fields.description, price: fields.price };
                    })


                // check if duck with name already exists in mongodb
                await Duck.find({ name: new RegExp(`^${name}$`) })
                    .then(res => {
                        if (res.length === 0) return;
                        throw new Error(`Duck  named '${name}' already exists`);
                    })

                // check if duck with name already exists in cloudinary
                // await cloudinary.api.sub_folders(CLOUDINARY_BASE_PATH + _id)
                //     .then(_ => {
                //         throw { error: new Error(`Duck  named '${name}' already exists`) }; // matching error format recieved from server for .catch
                //     })
                //     .catch(error => {
                //         if (error.error.http_code === 404) return; // Folder does not exist, creation can continue
                //         throw error.error // all other errors are thrown
                //     })

                const duck: HydratedDocument<DuckSchemaType> = new Duck({
                    name: name,
                    description: description,
                    images: [],
                    price: price
                })

                // upload images to cloudinary, store relavant data in variable
                const imagesData = [];
                for (let i = 0; i < images.length; i++) {
                    const { public_id, asset_id, secure_url, resource_type, type, format, } = await cloudinary.uploader.upload(images[i].filepath, { folder: CLOUDINARY_BASE_PATH + duck._id })

                    imagesData.push({
                        public_id,
                        asset_id,
                        secure_url,
                        format,
                        resource_type,
                        delivery_type: type, // named type in response, but refered to as 'delivery type' in documentation
                    });
                }

                duck.images = imagesData;
                duck.save({ validateBeforeSave: true, }).catch(e => { throw e })

                return res.json({ message: `${name} -- created successfully.` })
            }

            catch (e: any) {
                return res.status(400).json({ message: e?.message })
            }
            break;
        default:
            res.status(400).json({ message: 'Method not supported' })
    }
}

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};