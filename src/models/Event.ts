import {model, Schema} from "mongoose"
import {isRequired} from "../utils/utils"
import {IUser, Sports} from "./User"
import {IFile} from "./File"
import {DocWithTimeStamps} from "../types";

interface IEvent extends DocWithTimeStamps {
    creator: IUser
    title: string
    description: string
    location: {
        latitude: number
        longitude: number
        latitudeDelta: number
        longitudeDelta: number
    }
    sports?: Array<Sports>
    isLiked: boolean
    likesCount: number
    filterMembers: boolean
    attachments?: Array<string | IFile>
    date: Date
    members?: Array<string | IUser>
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
    isLiked: {
        type: Boolean,
        default: false
    },
    likesCount: {
        type: Number,
        default: 0
    },
    filterMembers: Boolean,
    attachments: [{
        type: Schema.Types.ObjectId, ref: "File"
    }],
    date: Date,
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    maxMembersCount: Number,
}, {timestamps: true, versionKey: false})

export const EventModel = model<IEvent>("Event", EventSchema)