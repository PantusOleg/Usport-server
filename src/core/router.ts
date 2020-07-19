import {Application, json, Request, Response} from "express"

import UserService from "../services/UserService"
import EventService from "../services/EventService"
import FileService from "../services/FileService"
import TrainingService from "../services/TrainingService"
import ChatService from "../services/ChatService"
import MessageService from "../services/MessageService"

import {loginValidation, registerValidation, updateValidation} from "../utils/validations/userValidation"
import {eventValidation} from "../utils/validations/eventValidation"
import {
    chatValidation, dialogValidation, messageValidation, trainingValidation
} from "../utils/validations/otherValidation"

import {checkAuth, ReqWithUserId} from "../middlewares/checkAuth"

export function useRoutes(app: Application) {
    app.use(json({limit: "30mb"}))
    app.use((req, res, next) => checkAuth(req as ReqWithUserId, res, next))

    const User = new UserService()
    const Event = new EventService()
    const Training = new TrainingService()
    const Chat = new ChatService()
    const Message = new MessageService()

    app.post("/api/user/get", User.getById)
    app.post("/api/user/create", registerValidation, User.create)
    app.post("/api/user/delete", User.delete)
    app.post("/api/user/update", updateValidation, User.update)
    app.post("/api/user/login", loginValidation, User.login)

    app.post("/api/event/getById", Event.getById)
    app.post("/api/event/getByMember", Event.getByMember)
    app.post("/api/event/create", eventValidation, (req: Request, res: Response) => Event.create(req as ReqWithUserId, res))
    app.post("/api/event/delete", (req, res) => Event.delete(req as ReqWithUserId, res))
    app.post("/api/event/update", eventValidation, Event.update)
    app.post("/api/event/likeOrUnlike", Event.likeOrUnlike)

    app.post("/api/file/create", (req, res) => FileService.create(req as ReqWithUserId, res))
    app.post("/api/file/delete", (req, res) => FileService.delete(req as ReqWithUserId, res))

    app.post("/api/training/get", Training.getById)
    app.post("/api/training/getByCreator", Training.getByCreator)
    app.post("/api/training/create", trainingValidation, Training.create)
    app.post("/api/training/delete", (req, res) => Training.delete(req as ReqWithUserId, res))
    app.post("/api/training/update", trainingValidation, Training.update)

    app.post("/api/chat/get", Chat.getById)
    app.post("/api/chat/getMyChats", (req, res) => Chat.getMyChats(req as ReqWithUserId, res))
    app.post("/api/chat/create", chatValidation, Chat.create)
    app.post("/api/chat/createDialog", dialogValidation, Chat.createDialog)
    app.post("/api/chat/leave", (req, res) => Chat.leave(req as ReqWithUserId, res))
    app.post("/api/chat/update", chatValidation, Chat.update)

    app.post("/api/message/get", Message.getById)
    app.post("/api/message/getByDialog", Message.getByDialog)
    app.post("/api/message/create", messageValidation, (req: Request, res: Response) => Message.create(req as ReqWithUserId, res))
    app.post("/api/message/delete", (req, res) => Message.delete(req as ReqWithUserId, res))
    app.post("/api/message/update", messageValidation, Message.update)

    return app
}