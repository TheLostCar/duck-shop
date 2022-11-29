import CredentialsProvider from "next-auth/providers/credentials"
import User, { UserDocumentType, UserSchemaType } from "@models/User";
import dbConnect from "lib/dbConnect";
import { HydratedDocument } from "mongoose";
import nextAuth, { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'Credentials',

            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            // @ts-expect-error: https://github.com/nextauthjs/next-auth/issues/2701
            async authorize(credentials) {
                await dbConnect();
                const invalidData = new Error('Invalid Credentials')
                if (!credentials?.username || !credentials.password) return null;
                const { username, password } = credentials;

                try {
                    const user: HydratedDocument<UserDocumentType> = await User.findOne({ username }).catch(e => { throw e });
                    if (!user) { throw invalidData };

                    await user.comparePassword(password)
                        .then(result => {
                            if (!result) throw invalidData;
                            return result
                        })

                    return {
                        _id: user._id.toString(),
                        username: user.username,
                        isAdmin: user.isAdmin,
                    }
                } catch (e) {
                    throw invalidData;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token, user }: { session: any, token: any, user: any }) {
            session.user = token.user;
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.user = user;
            }
            return token
        }
    },
    session: {
        strategy: 'jwt',
        // maxAge: 3000

    },
    theme: {
        colorScheme: "light",
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET


}
export default nextAuth(authOptions)