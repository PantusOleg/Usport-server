import mongoose from "mongoose"
import {isRequired} from "../utils/utils"
import {IUser} from "./User"
import {IFile} from "./File"

export interface ITraining extends mongoose.Document {
    creator: IUser | string
    exercises: Array<{
        name: String,
        timesCount: Number,
        minutesToDo: Number
    }>
    attachments?: Array<IFile>
}

const TrainingSchema = new mongoose.Schema<ITraining>({
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: isRequired("Creator")
    },
    exercises: [{
        name: {
            type: String,
            required: isRequired("Name")
        },
        timesCount: {
            type: Number,
            required: isRequired("TimesCount")
        },
        minutesToDo: {
            type: Number,
            required: isRequired("minutesToDo")
        }
    }],
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }]
}, {versionKey: false})

export const TrainingModel = mongoose.model<ITraining>("Training", TrainingSchema)