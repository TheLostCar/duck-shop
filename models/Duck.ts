import mongoose, { Date, Decimal128, LeanDocument, ObjectId, Schema } from 'mongoose';

enum Tags {
    Patriotic,
    Stylish,
    EyeOpening,
    Athletic,
    Immersive,
}

// Image interface
interface Image {
    public_id: string;
    asset_id: string;
    secure_url: string;
    resource_type: string;
    delivery_type: string;
    format: string;
}
const ImageSchema = new Schema<Image>({
    public_id: { type: String, required: true },
    asset_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    resource_type: { type: String, required: true },
    delivery_type: { type: String, required: true },
    format: { type: String, required: true },

}, { _id: false })

export interface DuckSchemaType {
    name: string;
    description: string;
    images: Image[];
    likes: number;
    views: number;
    price: Decimal128;
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type LeanDuckSchemaType = (LeanDocument<DuckSchemaType> & {
    _id: string;
    price: string;
    createdAt: string;
    updatedAt: string;
})

// Duck Schema
const DuckSchema = new Schema<DuckSchemaType>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: {
        type: mongoose.Types.Decimal128,
        set: (v: string) => mongoose.Types.Decimal128.fromString(v),
        get: (v: mongoose.Types.Decimal128) => v.toString(),
        required: true
    },

    images: {
        type: [ImageSchema], required: true
    },

    likes: { type: Number, required: true, default: 0 },
    views: { type: Number, required: true, default: 0 },
}, {
    timestamps: true,
});

export default mongoose.models.Duck || mongoose.model('Duck', DuckSchema);