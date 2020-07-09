import mongoose, {Document, Schema} from "mongoose"
import {isRequired} from "../utils/utils"

export interface IFile extends Document {
    uri: string
    public_id: string
    creator: string
    type: "image/jpg" | "video/mp4"
}

const FileSchema = new Schema<IFile>({
    uri: {
        type: String,
        required: isRequired("URI")
    },
    public_id: {
        type: String,
        required: isRequired("Public_id")
    },
    type: {
        type: String,
        required: isRequired("Type")
    },
    creator: {
        type: Schema.Types.ObjectId, ref: "User",
        required: isRequired("Creator")
    }
}, {versionKey: false})

export const FileModel = mongoose.model<IFile>("File", FileSchema)