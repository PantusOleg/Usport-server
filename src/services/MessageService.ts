import BaseService from "./BaseService"
import {IMessage, MessageModel} from "../models/Message"
import {Request, Response} from "express"
import {Server} from "socket.io"
import {ReqWithUserId} from "../middlewares/checkAuth"

export default class MessageService extends BaseService<IMessage>{

    private readonly io: Server

    constructor(io: Server) {
        super("Message", MessageModel, "attachments", req => ({
            creator: req.userId,
            chat: req.body.chat,
            text: req.body.text,
            attachments: req.body.attachments
        }))
        this.io = io
    }

    getByChat = (req: Request, res: Response) => this.getBy(req, res, {chat: req.params.chat})

    create = (req: ReqWithUserId, res: Response) => this.Create(req, res, undefined, message => {
        this.io.to(message.chat).emit("MESSAGE/SENT", message)
    })

    delete = (req: ReqWithUserId, res: Response) => this.Delete(req, res, undefined, message => {
        this.io.to(message.chat).emit("MESSAGE/DELETED", {
            creator: message.creator,
            messageId: message._id
        })
    })

    update = (req: Request, res: Response) => this.Update(req, res, message => {
        this.io.to(message.chat).emit("MESSAGE/UPDATED", message)
    })
}