import {Document, model, Schema} from "mongoose"
import {IMessage} from "./Message"
import {IUser} from "../types"

export interface IChat extends Document {
    members: (IUser | string)[]
    photo: string
    lastMessage: IMessage | string
}

const ChatSchema = new Schema<IChat>({
    members: [{
        type: Schema.Types.ObjectId, ref: "User"
    }],
    photo: String,
    lastMessage: {
        type: Schema.Types.ObjectId, ref: "Message"
    }
}, {versionKey: false})

export const ChatModel = model<IChat>("Chat", ChatSchema)