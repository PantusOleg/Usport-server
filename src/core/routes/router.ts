import UserService from "../../services/UserService"
import bodyParser from "body-parser"
import {Application} from "express"
import {loginValidation, registerValidation, updateValidation} from "../../utils/validations"
import {checkAuth} from "../../middlewares/checkAuth"

export function useRoutes(app: Application) {
    app.use(bodyParser.json())
    app.use(checkAuth)

    const User = new UserService()

    app.post("/api/user/get", User.getById)
    app.post("/api/user/create", registerValidation, User.create)
    app.post("/api/user/delete", User.delete)
    app.post("/api/user/update", updateValidation, User.update)
    app.post("/api/user/login", loginValidation, User.login)

    return app
}