import mongoose from "mongoose"
import {isRequired} from "../utils/utils"
import {IFile} from "./File"
import {DocWithTimeStamps, IUser} from "../types"

export interface ITraining extends DocWithTimeStamps {
    creator: IUser | string
    name: string
    exercises: {
        name: string
        timesCount: number
        minutesToDo: number
        tempo: 0 | 1 | 2
    }[]
    attachments: IFile[]
    sports: number[]
}

const Tempo = [0, 1, 2]

const TrainingSchema = new mongoose.Schema<ITraining>({
    name: {
        type: String,
        required: isRequired("Name")
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: isRequired("Creator")
    },
    exercises: [{
        name: {
            type: String,
            required: isRequired("Exercise Name")
        },
        timesCount: {
            type: Number,
            required: isRequired("TimesCount")
        },
        minutesToDo: {
            type: Number,
            required: isRequired("minutesToDo")
        },
        tempo: Tempo
    }],
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    sports: [Number]
}, {timestamps: true, versionKey: false})

export const TrainingModel = mongoose.model<ITraining>("Training", TrainingSchema)