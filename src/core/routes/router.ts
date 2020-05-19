import UserService from "../../services/UserService"
import EventService from "../../services/EventService"
import bodyParser from "body-parser"
import {Application} from "express"
import {loginValidation, registerValidation, updateValidation} from "../../utils/validations/userValidation"
import {checkAuth, ReqWithUserId} from "../../middlewares/checkAuth"
import {eventValidation} from "../../utils/validations/eventValidation"

export function useRoutes(app: Application) {
    app.use(bodyParser.json())
    app.use((req, res, next) => checkAuth(req as ReqWithUserId, res, next))

    const User = new UserService()
    const Event = new EventService()

    app.post("/api/user/get", User.getById)
    app.post("/api/user/create", registerValidation, User.create)
    app.post("/api/user/delete", User.delete)
    app.post("/api/user/update", updateValidation, User.update)
    app.post("/api/user/login", loginValidation, User.login)

    app.post("/api/event/get", Event.getById)
    app.post("/api/event/create", eventValidation, Event.create)
    app.post("/api/event/delete", (req, res) => Event.delete(req as ReqWithUserId, res))
    app.post("/api/event/update", eventValidation, Event.update)

    return app
}