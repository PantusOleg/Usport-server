import {Request, Response} from "express"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {EventModel} from "../models/Event"
import {validationResult} from "express-validator"
import {ReqWithUserId} from "../middlewares/checkAuth"

export default class EventService {
    getById = (req: Request, res: Response) =>
        EventModel.findById(req.body.id).populate(["creator", "attachments"]).exec((err, event) => {
            if (err || !event) return errorRes(res, 404, "Event is not found")

            successRes(res, event)
        })

    getByMember = (req: Request, res: Response) =>
        EventModel.find({members: req.body.memberId}).populate(["creator", "attachments"])
            .exec((err, events) => {
                if (err || events.length <= 0) return warningRes(res, "No events")

                successRes(res, events)
            })

    create = async (req: ReqWithUserId, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        try {
            await new EventModel({
                creator: req.userId,
                title: req.body.title,
                description: req.body.description,
                location: req.body.location,
                sports: req.body.sports,
                filterMembers: req.body.filterMembers,
                date: req.body.date,
                members: req.body.members,
                maxMembersCount: req.body.maxMembersCount,
                attachments: req.body.attachments
            }).save()

            successRes(res, undefined, "Event is created")

            //TODO: Send a notifications to members
        } catch (err) {
            return errorRes(res, 500, "Can't create event. Try again!")
        }
    }

    delete = (req: ReqWithUserId, res: Response) =>
        EventModel.findById(req.body.id, (err, event) => {
            if (err || !event) return errorRes(res, 404, "Event is not found")

            if (event.creator.toString() !== req.userId.toString())
                return errorRes(res, 403, "You haven't permission to delete this event")

            event.remove()
                .then(() => successRes(res, null, "User is deleted"))
                .catch(err => warningRes(res, err.message || err))
        })

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        EventModel.findByIdAndUpdate(req.body.id, {...req.body}, {new: true}, (err, event) => {
            if (err || !event) return errorRes(res, 403, "Event is not found")

            successRes(res, event)
        })
    }

    likeOrUnlike = (req: Request, res: Response) =>
        EventModel.findById(req.body.id, (err, event) => {
            if (err || !event) return errorRes(res, 404, "Event is not found")

            event.updateOne({
                likesCount: event.isLiked ? event.likesCount - 1 : event.likesCount + 1,
                isLiked: !event.isLiked
            }).then(updated => successRes(res, null, updated.isLiked ? "Event is liked" : "Event is unliked"))
                .catch(err => warningRes(res, "Can't like or unlike event"))
        })
}