import mongoose, {Document, Schema} from "mongoose"
import {isRequired} from "../utils/utils"

export interface IFile extends Document {
    uri: string
    public_id: string
    creator: string
    type: "image/jpg" | "video/mp4"
    //ratio of height to width
    hwRatio: number
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
    creator: String,
    hwRatio: Number
}, {versionKey: false})

export const FileModel = mongoose.model<IFile>("File", FileSchema)