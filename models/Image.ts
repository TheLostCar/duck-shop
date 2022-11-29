import { Schema, model, models } from "mongoose";

interface Image {
    img: Buffer
}

const ImageSchema = new Schema<Image>({
    img: {
        type: Buffer,
    }
});

export default models.User || model('Image', ImageSchema)