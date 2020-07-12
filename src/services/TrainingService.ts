import {Request, Response} from "express"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {TrainingModel} from "../models/Training"
import {ReqWithUserId} from "../middlewares/checkAuth"
import {validationResult} from "express-validator"

export default class TrainingService {
    getById = (req: Request, res: Response) =>
        TrainingModel.findById(req.body.id, (err, training) => {
            if (err || !training) return warningRes(res, "Training is not found")

            successRes(res, training)
        })

    create = async (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        new TrainingModel({
            creator: req.body.creator,
            exercises: req.body.exercises,
            attachments: req.body.attachments
        }).save()
            .then(training => successRes(res, training))
            .catch(() => warningRes(res, "Can't create training"))
    }

    delete = (req: ReqWithUserId, res: Response) =>
        TrainingModel.findById(req.body.id, (err, training) => {
            if (err || !training) return errorRes(res, 404, "Training is not found")

            if (req.userId.toString() === training.creator.toString()) {
                training.remove()
                    .then(() => successRes(res, null, "Training is deleted"))
                    .catch(() => "Can't delete training")
            } else
                warningRes(res, "You haven't permission for this action")
        })

    update = (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        TrainingModel.findByIdAndUpdate(req.body._id, {...req.body}, (err, newTraining) => {
            if (err || !newTraining) return errorRes(res, 404, "Training is not found or not updated")

            successRes(res, newTraining)
        })
    }
}