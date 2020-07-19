import {MessageModel} from "../models/Message"
import {validationResult} from "express-validator"
import {Request, Response} from "express"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {ReqWithUserId} from "../middlewares/checkAuth"

export default class MessageService {

    getById = (req: Request, res: Response) =>
        MessageModel.findById(req.body.id).populate(["creator", "attachments"]).exec((err, message) => {
            if (err || !message) return errorRes(res, 404, "Message is not found")

            successRes(res, message)
        })

    getByDialog = (req: Request, res: Response) =>
        MessageModel.find({dialog: req.body.dialog}).populate(["creator", "attachments"])
            .exec((err, messages) => {

                if (err || messages.length === 0) return warningRes(res, "No messages")

                successRes(res, messages)
            })

    create = async (req: ReqWithUserId, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        new MessageModel({
            creator: req.userId,
            chat: req.body.chat,
            dialog: req.body.dialog,
            text: req.body.text,
            attachments: req.body.attachments,
        }).save()
            .then(message => {
                successRes(res, message)

                //TODO: update conversation's last message
            })
            .catch((err) => {
                console.log(err.message)
                warningRes(res, "Can't create message")
            })
    }

    delete = (req: ReqWithUserId, res: Response) =>
        MessageModel.findById(req.body.id, (err, message) => {
            if (err || !message) return errorRes(res, 404, "Message is not found")

            if (req.userId.toString() === message.creator.toString()) {
                message.remove()
                    .then(() => successRes(res, null, "Message is deleted"))
                    .catch(() => "Can't delete message")
            } else
                warningRes(res, "You haven't permission for this action")
        })

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        MessageModel.findByIdAndUpdate(req.body._id, {...req.body}, (err, message) => {
            if (err || !message) return errorRes(res, 404, "Message is not updated")

            successRes(res, null, "Message is updated")
        })
    }
}