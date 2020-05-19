import {BaseService} from "./BaseService"
import {Request, Response} from "express"
import {errorRes, successRes} from "../utils/utils"
import {EventModel} from "../models/Event"
import {validationResult} from "express-validator"
import {ReqWithUserId} from "../middlewares/checkAuth"

class EventService implements BaseService {
    getById = (req: Request, res: Response) => {
        const {id, withCreator} = req.body

        EventModel.findById(id, (err, event) => {
            if (err || !event) return errorRes(res, 404, "Event is not found")
            if (withCreator) return event.populate("creator")
                .execPopulate().then(event => successRes(res, event))

            successRes(res, event)
        })
    }
    create = async (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return errorRes(res, 422, errors.array()[0].msg)

        const newEvent = {
            creator: req.body.creator,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            sports: req.body.sports,
            filterMembers: req.body.filterMembers,
            photo: req.body.photo,
            date: req.body.date,
            members: req.body.members,
            maxMembersCount: req.body.maxMembersCount
        }

        try {
            const event = await new EventModel(newEvent).save()

            successRes(res, event)

            //TODO: Send a notifications to members
        } catch (err) {
            return errorRes(res, 500, "Can't create event. Try again!")
        }
    }

    delete = (req: ReqWithUserId, res: Response) => {
        console.log(req.userId)
        const {id} = req.body
        const userId = req.userId

        EventModel.findById(id, (err, event) => {
            if (err || !event) return errorRes(res, 404, "Event is not found")
            if (event.creator.toString() !== userId.toString())
                return errorRes(res, 403, "You haven't permission to delete this event")

            event.remove()
                .then(() => successRes(res, null, "User is deleted"))
                .catch(err => errorRes(res, 404, err.message || err))
        })
    }

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return errorRes(res, 422, errors.array()[0].msg)

        const event = req.body

        EventModel.findByIdAndUpdate(event.id, {...event},{new: true}, (err, event) => {
            if (err || !event) return errorRes(res, 404, "Event is not found")

            successRes(res, event)
        })
    }
}

export default EventService