import {model, Schema} from "mongoose"
import {DocWithTimeStamps, IUser} from "../types"
import {IFile} from "./File"

export interface IMessage extends DocWithTimeStamps {
    creator: IUser | string
    chat: string
    text: string
    attachments: (IFile | string)[]
    checked: boolean
}

const MessageSchema = new Schema<IMessage>({
    creator: String,
    chat: String,
    text: String,
    attachments: [{
        type: Schema.Types.ObjectId, ref: "File"
    }],
    checked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false})

export const MessageModel = model<IMessage>("Message", MessageSchema)