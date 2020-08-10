import BaseService from "./BaseService"
import {ChatModel, IChat} from "../models/Chat"
import {Response} from "express"
import {ReqWithUserId} from "../middlewares/checkAuth"
import {errorRes, successRes} from "../utils/utils"
import {MessageModel} from "../models/Message"

async function leaveOne(chat: IChat, userId: string) {
    if (chat.members.length === 2) {
        await chat.remove()
        await MessageModel.deleteMany({chat: chat._id})
    } else {
        await chat.updateOne({
            members: chat.members.filter(m => m.toString() !== userId)
        })
    }
}

export default class ChatService extends BaseService<IChat> {

    constructor() {
        super("Chat", ChatModel, ["members", "lastMessage"], req => ({
            members: req.body.members,
            photo: req.body.photo,
            lastMessage: req.body.lastMessage
        }))
    }

    getMyChats = (req: ReqWithUserId, res: Response) => this.getBy(req, res, {members: req.userId})

    leave = (req: ReqWithUserId, res: Response) => ChatModel.findById(req.params.id, async (err, chat) => {

        if (err || !chat) return errorRes(res, 404, "Chat is not found")

        try {
            await leaveOne(chat, req.userId.toString())

            successRes(res, null, "Chat is left")
        } catch (err) {
            errorRes(res, 500, err.message)
        }
    })

    static leaveAll = async (userId: string) => {
        const chats = await ChatModel.find({members: userId})

        chats.forEach(chat => leaveOne(chat, userId))
    }
}