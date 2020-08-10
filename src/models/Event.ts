import {model, Schema} from "mongoose"
import {isRequired} from "../utils/utils"
import {IFile} from "./File"
import {DocWithTimeStamps, IUser, Sports} from "../types"

export interface IEvent extends DocWithTimeStamps {
    creator: string | IUser
    title: string
    description: string
    location: {
        latitude: number
        longitude: number
        latitudeDelta: number
        longitudeDelta: number
    }
    sports?: Sports[]
    private: boolean
    attachments?: (string | IFile)[]
    date: Date
    members: (string | IUser)[]
    maxMembersCount?: number
}

const EventSchema = new Schema<IEvent>({
    creator: {
        type: Schema.Types.ObjectId, ref: "User",
        required: isRequired("Creator")
    },
    title: {
        type: String,
        required: isRequired("Title")
    },
    description: {
        type: String,
        required: isRequired
    },
    location: {
        type: {
            latitude: Number,
            longitude: Number,
            latitudeDelta: Number,
            longitudeDelta: Number
        },
        required: isRequired("Location")
    },
    sports: [Number],
    attachments: [{
        type: Schema.Types.ObjectId, ref: "File"
    }],
    date: {
        type: Date,
        default: Date.now()
    },
    private: {
        type: Boolean,
        default: false
    },
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    maxMembersCount: Number,
}, {timestamps: true, versionKey: false})

export const EventModel = model<IEvent>("Event", EventSchema)