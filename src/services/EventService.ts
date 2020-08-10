import BaseService from "./BaseService"
import {EventModel, IEvent} from "../models/Event"
import {Request, Response} from "express"

export default class EventService extends BaseService<IEvent> {

    constructor() {
        super("Event", EventModel, ["creator", "attachments"], req => ({
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
        }))
    }

    getByMember = (req: Request, res: Response) => this.getBy(req, res, {members: req.params.member})
}