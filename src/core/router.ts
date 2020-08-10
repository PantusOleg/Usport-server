import {Application, json, Request, Response} from "express"

import UserService from "../services/UserService"
import EventService from "../services/EventService"
import FileService from "../services/FileService"
import TrainingService from "../services/TrainingService"
import ChatService from "../services/ChatService"
import MessageService from "../services/MessageService"

import {loginValidation, registerValidation, updateValidation} from "../utils/validations/userValidation"
import {eventValidation} from "../utils/validations/eventValidation"
import {chatValidation, messageValidation, trainingValidation} from "../utils/validations/otherValidation"

import {checkAuth, ReqWithUserId} from "../middlewares/checkAuth"
import {Server} from "socket.io"

export function useRoutes(app: Application, io: Server) {
    app.use(json({limit: "30mb"}))
    app.use((req, res, next) => checkAuth(req as ReqWithUserId, res, next))

    const User = new UserService()
    const Event = new EventService()
    const Training = new TrainingService()
    const Chat = new ChatService()
    const Message = new MessageService(io)

    app.post("/login", loginValidation, User.login)

    app.get("/user/get/:id", User.get)
    app.get("/user/saved/:id", User.getSaved)
    app.get("/user/isFriend/:id", (req, res) => User.isFriend(req as ReqWithUserId, res))
    app.post("/user", registerValidation, (req: Request, res: Response) => User.create(req as ReqWithUserId, res))
    app.post("/user/addFriend", (req, res) => User.addRemoveFriend(req as ReqWithUserId, res, "add"))
    app.post("/user/removeFriend", (req, res) => User.addRemoveFriend(req as ReqWithUserId, res, "remove"))
    app.delete("/user/:id", (req, res) => User.delete(req as ReqWithUserId, res))
    app.put("/user", updateValidation, User.Update)

    app.get("/event/get/:id", Event.get)
    app.get("/event/byMember/:member", Event.getByMember)
    app.post("/event", eventValidation, (req: Request, res: Response) => Event.Create(req as ReqWithUserId, res))
    app.delete("/event/:id", (req, res) => Event.Delete(req as ReqWithUserId, res))
    app.put("/event", eventValidation, Event.Update)

    app.post("/file", (req, res) => FileService.create(req as ReqWithUserId, res))
    app.delete("/file/:id", (req, res) => FileService.delete(req as ReqWithUserId, res))

    app.get("/training/get/:id", Training.get)
    app.get("/training/byCreator/:creator", Training.getByCreator)
    app.post("/training", trainingValidation, (req: Request, res: Response) => Training.Create(req as ReqWithUserId, res))
    app.delete("/training/:id", (req, res) => Training.Delete(req as ReqWithUserId, res))
    app.put("/training", trainingValidation, Training.Update)

    app.get("/chat/get/:id", Chat.get)
    app.get("/chat/my", (req, res) => Chat.getMyChats(req as ReqWithUserId, res))
    app.post("/chat", chatValidation, (req: Request, res: Response) => Chat.Create(req as ReqWithUserId, res))
    app.delete("/chat/leave/:id", (req, res) => Chat.leave(req as ReqWithUserId, res))
    app.put("/chat", chatValidation, Chat.Update)

    app.get("/message/get/:id", Message.get)
    app.get("/message/byChat/:chat", Message.getByChat)
    app.post("/message", messageValidation, (req: Request, res: Response) => Message.create(req as ReqWithUserId, res))
    app.delete("/message/:id", (req, res) => Message.delete(req as ReqWithUserId, res))
    app.put("/message", messageValidation, Message.update)

    return app
}