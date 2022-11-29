import dbConnect from '../../../lib/dbConnect';
import { HydratedDocument, LeanDocument } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserSchemaType } from '@models/User';

type Data = {
    message: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await dbConnect();
    switch (req.method) {
        case "POST":
            try {
                const { "username": username, "password": password } = req.body;

                // early return to prevent more registrations
                return res.status(405).json({ message: 'We are not accepting registrations at this time' })

                // registration handled below
                if (typeof username !== 'string') throw new Error('Invalid username');
                if (typeof password !== 'string') throw new Error('Invalid password');
                if (username.length < 4) throw new Error('username must be at least 4 characters')
                if (password.length < 8) throw new Error('password must be at least 8 characters')

                const user: HydratedDocument<UserSchemaType> = new User({
                    username: username,
                    password: password,
                })

                // password gets hashed in UserSchema.pre('save',...) defined in @models/User.ts
                // validates password before it gets hashed
                user.validate(err => {
                    if (err) {
                        throw err;
                    } else {
                        // password gets hashed and saved to MongoDB
                        user.save()
                    }
                })

                res.status(200).json({
                    message: 'User created successfully, you can now log in'
                })

            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
            break;
        default:
            res.status(400).json({ message: "Method not supported" })
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};