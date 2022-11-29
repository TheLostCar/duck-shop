import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface User {
        _id: string,
        username: string,
        isAdmin: boolean,
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT extends Record<string, unknown> {
        user?: {
            _id: string,
            username: string,
            isAdmin: boolean
        },
    }
}