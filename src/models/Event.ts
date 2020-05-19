import {Document, model, Schema} from "mongoose"
import {isRequired} from "../utils/utils"
import {IUser, Sports} from "./User"

interface IEvent extends Document {
    creator: string | IUser
    title: string
    description: string
    location: {
        latitude: number
        longitude: number
        latitudeDelta: number
        longitudeDelta: number
    }
    sports?: Array<Sports>,
    filterMembers: boolean
    photo?: Buffer
    date: Date
    members?: Array<IUser>
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
    sports: [Sports],
    filterMembers: Boolean,
    photo: Buffer,
    date: Date,
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    maxMembersCount: Number,
}, {timestamps: true, versionKey: false})

export const EventModel = model<IEvent>("Event", EventSchema)