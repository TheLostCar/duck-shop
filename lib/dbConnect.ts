import mongoose from 'mongoose'

declare global {
    var mongoose: {
        conn: null | typeof import('mongoose'),
        promise: null | Promise<typeof import('mongoose')>
    };
}

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

const opts = {
    bufferCommands: false,
}

export default async function dbConnect() {
    if (cached.conn) return cached.conn;


    if (!cached.promise) {
        // Create new connection
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then(mongoose => {
                return mongoose
            });
    }

    // wait for promise to resolve, cache and return connection
    cached.conn = await cached.promise;
    return cached.conn;
}