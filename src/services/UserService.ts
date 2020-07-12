import {Request, Response} from "express"
import {UserModel} from "../models/User"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {validationResult} from "express-validator"
import {createToken} from "../utils/jwtControl"

export default class UserService {

    getById = (req: Request, res: Response) =>
        UserModel.findById(req.body.id, (err, user) => {
            if (err || !user) return warningRes(res, "User is not found")

            successRes(res, user)
        })

    create = async (req: Request, res: Response) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        UserModel.find({email: req.body.email}, (err, users) => {
            if (users.length > 0) return warningRes(res, "This email is already used")
        })

        UserModel.find({userName: req.body.userName}, (err, users) => {
            if (users.length > 0) return warningRes(res, "This username is already used")
        })

        try {
            const user = await new UserModel({
                email: req.body.email,
                userName: req.body.userName,
                fullName: req.body.fullName,
                sports: req.body.sports,
                password: req.body.password,
                birthDate: req.body.birthDate,
                avatar: req.body.avatar
            }).save()

            const token = createToken(user.id)

            successRes(res, {user, token})

            //sendVerifyMessage(user.email, user.confirmHash)
        } catch (err) {
            return errorRes(res, 500, "Can't create user. Try again!")
        }
    }

    delete = (req: Request, res: Response) => {
        if (!req.body.password) return errorRes(res, 403, "Enter correct password")

        UserModel.findById(req.body.id, async (err, user) => {
            if (err || !user) return errorRes(res, 404, "User is not found")

            if (await UserModel.comparePasswords(user.id, req.body.password)) {
                try {
                    await user.remove()
                    successRes(res, null, "User is deleted")
                } catch (err) {
                    warningRes(res, err.message || err)
                }
            } else warningRes(res, "Please enter correct password")
        })
    }

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        UserModel.findByIdAndUpdate(req.body._id, {...req.body}, (err, newUser) => {
            if (err || !newUser) return errorRes(res, 404, "User not found or not updated")

            successRes(res, newUser)
        })
    }

    login = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        const loginData = {
            email: req.body.email,
            password: req.body.password
        }

        UserModel.findOne({email: loginData.email}, async (err, user) => {
            if (err || !user) return warningRes(res, "Incorrect email or password")

            if (await UserModel.comparePasswords(user.id, loginData.password)) {
                const token = createToken(user.id)

                successRes(res, {user, token})
            } else
                warningRes(res, "Incorrect email or password")
        })
    }
}
