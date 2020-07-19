import {Request, Response} from "express"
import {ChatModel} from "../models/Chat"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {validationResult} from "express-validator"
import {ReqWithUserId} from "../middlewares/checkAuth"

export default class ChatService {

    getById = (req: Request, res: Response) =>
        ChatModel.findById(req.body.id).populate(["members", "dialogs.lastMessage"]).exec((err, chat) => {
            if (err || !chat) return errorRes(res, 404, "Chat is not found")

            successRes(res, chat)
        })

    getMyChats = (req: ReqWithUserId, res: Response) =>
        ChatModel.find({members: req.userId}).populate(["members", "dialogs.lastMessage"])
            .exec((err, chats) => {

                if (err || chats.length === 0) return warningRes(res, "Chats is not found")

                successRes(res, chats)
            })

    create = async (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        new ChatModel({
            members: req.body.members,
            photo: req.body.photo,
            dialogs: [{
                name: "Main"
            }]
        }).save()
            .then(chat => successRes(res, chat))
            .catch(() => warningRes(res, "Can't create chat"))
    }

    createDialog = (req: Request, res: Response) => {
        const {id, dialog} = req.body

        ChatModel.findById(id, (err, chat) => {
            if (err || !chat) return errorRes(res, 404, "Chat is not found")

            chat.updateOne({dialogs: [...chat.dialogs, dialog]})
                .then(chat => successRes(res, chat))
                .catch(() => warningRes(res, "Can't create dialog"))
        })
    }

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        ChatModel.findByIdAndUpdate(req.body._id, {...req.body}, (err, chat) => {
            if (err || !chat) return errorRes(res, 404, "Chat is not found or not updated")

            successRes(res, null, "Chat is updated")
        })
    }

    leave = (req: ReqWithUserId, res: Response) =>
        ChatModel.findById(req.body.chatId, async (err, chat) => {

            if (err || !chat) return errorRes(res, 404, "Chat is not found")

            try {
                if (chat.members.length === 2) {
                    await chat.remove()
                } else {
                    await chat.updateOne({
                        members: chat.members.filter(m => m.toString() !== req.userId.toString())
                    })
                }

                successRes(res, null, "Chat is leaved")
            } catch (err) {
                errorRes(res, 500, err.message)
            }
        })
}
