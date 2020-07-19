import {Document, model, Schema} from "mongoose"
import {isRequired} from "../utils/utils"
import {IUser} from "./User"
import {IMessage} from "./Message"

export interface IChat extends Document {
    members: (IUser | string)[]
    photo: string
    dialogs: {
        _id: string
        name: string
        goal: string
        lastMessage: IMessage | string
    }[]
}

const ChatSchema = new Schema<IChat>({
    members: [{
        type: Schema.Types.ObjectId, ref: "User"
    }],
    photo: String,
    dialogs: [{
        name: {
            type: String,
            required: isRequired("Dialog name")
        },
        goal: String,
        lastMessage: {
            type: Schema.Types.ObjectId, ref: "Message"
        }
    }]
}, {versionKey: false})

export const ChatModel = model<IChat>("Chat", ChatSchema)