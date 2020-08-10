import BaseService from "./BaseService"
import {ITraining, TrainingModel} from "../models/Training"
import {Request, Response} from "express"

export default class TrainingService extends BaseService<ITraining> {

    constructor() {
        super("Training", TrainingModel, ["creator", "attachments"], req => ({
            creator: req.userId,
            name: req.body.name,
            exercises: req.body.exercises,
            attachments: req.body.attachments,
            sports: req.body.sports
        }))
    }

    getByCreator = (req: Request, res: Response) => this.getBy(req, res, {creator: req.params.creator})
}