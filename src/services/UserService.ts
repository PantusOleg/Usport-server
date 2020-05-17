import {BaseService} from "./BaseService"
import {Request, Response} from "express"
import {UserModel} from "../models/User"
import {errorRes, successRes} from "../utils/utils"
import {validationResult} from "express-validator"
import {createToken} from "../utils/jwtControl"

class UserService implements BaseService {

    getById = (req: Request, res: Response) => {
        const {id} = req.body

        UserModel.findById(id, (err, user) => {
            if (err || !user) return errorRes(res, 404, "User is not found")

            successRes(res, user)
        })
    }

    create = async (req: Request, res: Response) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) return errorRes(res, 422, errors.array()[0].msg)

        UserModel.find({email: req.body.email}, (err, user) => {
            if (user.length > 0) return errorRes(res, 400, "This email is already used")
        })

        UserModel.find({userName: req.body.userName}, (err, user) => {
            if (user.length > 0) return errorRes(res, 400, "This username is already used")
        })

        const newUser = {
            email: req.body.email,
            userName: req.body.userName,
            fullName: req.body.fullName,
            sports: req.body.sports,
            password: req.body.password,
            birthDate: req.body.birthDate
        }

        try {
            const user = await new UserModel(newUser).save()
            const token = createToken(user.email)

            successRes(res, {user, token})

            //sendVerifyMessage(user.email, user.confirmHash)
        } catch (err) {
            return errorRes(res, 500, "Can't create user. Try again!")
        }
    }

    delete = (req: Request, res: Response) => {
        const {id, password} = req.body

        if (!password) return errorRes(res, 403, "Enter correct password")

        UserModel.findById(id, async (err, user) => {
            if (err || !user) return errorRes(res, 404, "User is not found")

            if (await UserModel.comparePasswords(user.id, password)) {
                try {
                    await user.remove()
                    return successRes(res, null, "User is deleted")
                } catch (err) {
                    return errorRes(res, 404, err.message || err)
                }
            } else errorRes(res, 403, "Please enter correct password")
        })
    }

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return errorRes(res, 422, errors.array()[0].msg)

        const user = req.body

        UserModel.findByIdAndUpdate(user.id, {...user}, (err, newUser) => {
            if (err || !newUser) return errorRes(res, 404, "User not found or not updated")

            successRes(res, newUser)
        })
    }

    login = (req: Request, res: Response) => {
        console.log(req.body)
        const errors = validationResult(req)

        if (!errors.isEmpty()) return errorRes(res, 404, errors.array()[0].msg)

        const loginData = {
            email: req.body.email,
            password: req.body.password
        }

        UserModel.findOne({email: loginData.email}, async (err, user) => {
            if (err || !user) return errorRes(res, 403, "Incorrect email or password")
            if (await UserModel.comparePasswords(user.id, loginData.password)) {
                const token = createToken(loginData.email)

                successRes(res, {user, token})
            } else
                errorRes(res, 403, "Incorrect email or password")
        })
    }

}

export default UserService
