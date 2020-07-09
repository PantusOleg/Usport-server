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

        const newUser = {
            email: req.body.email,
            userName: req.body.userName,
            fullName: req.body.fullName,
            sports: req.body.sports,
            password: req.body.password,
            birthDate: req.body.birthDate,
            avatar: req.body.avatar
        }

        try {
            const user = await new UserModel(newUser).save()
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
                    return successRes(res, null, "User is deleted")
                } catch (err) {
                    return warningRes(res, err.message || err)
                }
            } else warningRes(res, "Please enter correct password")
        })
    }

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        UserModel.findByIdAndUpdate(req.body.id, {...req.body}, (err, newUser) => {
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

    /*setAvatar = (req: ReqWithUserId, res: Response) =>
        UserModel.findById(req.query.userId, async (err, user) => {
            if (err || !user) return errorRes(res, 403, "User is not found")

            if (req.userId.toString() !== user.id.toString())
                return errorRes(res, 404, "You haven't permission to set avatar")

            const fileId = await FileService.create(req, res)

            user.updateOne({avatar: fileId}, err => {
                if (err) return errorRes(res, 500, err.message)
                successRes(res, null, "Avatar is set")
            })
        })*/
}
