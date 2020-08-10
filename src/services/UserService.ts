import BaseService from "./BaseService"
import {UserModel} from "../models/User"
import {EventModel} from "../models/Event"
import ChatService from "./ChatService"
import {IUser} from "../types"
import {Request, Response} from "express"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {ReqWithUserId} from "../middlewares/checkAuth"
import {validationResult} from "express-validator"
import {createToken} from "../utils/jwtControl"

export default class UserService extends BaseService<IUser> {

    constructor() {
        super("User", UserModel, [], req => ({
            email: req.body.email,
            userName: req.body.userName,
            fullName: req.body.fullName,
            sports: req.body.sports,
            password: req.body.password,
            birthDate: req.body.birthDate,
            avatar: req.body.avatar
        }))
    }

    getSaved = (req: Request, res: Response) =>
        UserModel.findWithSaved(req.params.id)
            .then(user => successRes(res, {
                savedEvents: user.savedEvents,
                savedTrainings: user.savedTrainings
            }))
            .catch(err => errorRes(res, 500, err.message))

    isFriend = (req: ReqWithUserId, res: Response) =>
        UserModel.find({_id: req.params.id, friends: [req.userId]}, (err, user) => {
            successRes(res, {isFriend: !!(!err && user)})
        })

    create = (req: ReqWithUserId, res: Response) => this.Create(req, res, () => {
        UserModel.find({email: req.body.email}, (err, users) => {
            if (users.length > 0) return warningRes(res, "This email is already used")
        })

        UserModel.find({userName: req.body.userName}, (err, users) => {
            if (users.length > 0) return warningRes(res, "This username is already used")
        })
    })

    delete = (req: ReqWithUserId, res: Response) => this.Delete(req, res,
        user => req.userId.toString() === user._id.toString(),
        async (user) => {
            await EventModel.deleteMany({creator: user._id})

            await ChatService.leaveAll(user._id)
        })

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

    addRemoveFriend = async (req: ReqWithUserId, res: Response, type: "add" | "remove") => {
        const user = await UserModel.findById(req.body.id).select("friends")

        if (user) {

            /*if (type === "add" && user.friends.find(f => f === req.userId))
                return warningRes(res, "You can't add friend twice")*/

            await user.updateOne({
                friends: type === "add"
                    ? [...user.friends, req.userId]
                    : user.friends.filter(f => f !== req.userId)
            })
        } else return errorRes(res, 400, "User is not found")

        successRes(res)
    }
}