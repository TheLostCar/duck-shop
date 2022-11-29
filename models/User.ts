import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
const SALT_ROUNDS = 12;

export type UserSchemaType = {
    username: string;
    password: string;
    liked: mongoose.Types.ObjectId[]
    cart: mongoose.Types.ObjectId[]
    isAdmin: boolean;

}
export interface UserDocumentType extends UserSchemaType, Document {
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<UserDocumentType>({
    username: { type: String, required: true, unique: true, minlength: 4 },
    password: { type: String, required: true, minlength: 8 },
    liked: { type: [mongoose.Types.ObjectId], required: true, default: [] },
    cart: { type: [mongoose.Types.ObjectId], required: true, default: [] },
    isAdmin: { type: Boolean, required: true, default: false }
});

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next()
    })
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<UserDocumentType>('User', UserSchema);
