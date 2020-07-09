import UserService from "../services/UserService"
import EventService from "../services/EventService"
import express, {Application} from "express"
import {loginValidation, registerValidation, updateValidation} from "../utils/validations/userValidation"
import {checkAuth, ReqWithUserId} from "../middlewares/checkAuth"
import {eventValidation} from "../utils/validations/eventValidation"
import FileService from "../services/FileService";

export function useRoutes(app: Application) {
    app.use(express.json({limit: "30mb"}))
    app.use((req, res, next) => checkAuth(req as ReqWithUserId, res, next))

    const User = new UserService()
    const Event = new EventService()

    app.post("/api/user/get", User.getById)
    app.post("/api/user/create", registerValidation, User.create)
    app.post("/api/user/delete", User.delete)
    app.post("/api/user/update", updateValidation, User.update)
    app.post("/api/user/login", loginValidation, User.login)

    app.post("/api/event/getById", Event.getById)
    app.post("/api/event/getByMember", Event.getByMember)
    app.post("/api/event/create", eventValidation, (req: express.Request, res: express.Response) =>
        Event.create(req as ReqWithUserId, res))
    app.post("/api/event/delete", (req, res) => Event.delete(req as ReqWithUserId, res))
    app.post("/api/event/update", eventValidation, Event.update)

    app.post("/api/file/create", (req, res) => FileService.create(req as ReqWithUserId, res))
    app.post("/api/file/delete", (req, res) => FileService.delete(req as ReqWithUserId, res))

    return app
}