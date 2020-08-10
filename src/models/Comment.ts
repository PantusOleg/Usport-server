import {Schema, model, Document} from "mongoose"
import {isRequired} from "../utils/utils"
import {IUser} from "./User"

interface IComment extends Document {
    creator: string | IUser
    event: string
    training: string
    text: string
    replies: (string | IComment)[]
}

const CommentSchema = new Schema<IComment>({
    creator: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    event: String,
    training: String,
    text: {
        type: String,
        require: isRequired("Text")
    },
    replies: [{type: Schema.Types.ObjectId, ref: "Comment"}]
})

export const CommentModel = model<IComment>("Comment", CommentSchema)