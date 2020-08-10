import {Document, FilterQuery, Model} from "mongoose"
import {validationResult} from "express-validator"
import {Request, Response} from "express"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {ReqWithUserId} from "../middlewares/checkAuth"
import {IUser} from "../types"

type Doc = Document & {
    creator?: string | IUser
}

type Then<D> = (doc: D) => void

export default class BaseService<D extends Doc> {

    private readonly name: string
    private readonly model: Model<D>
    private readonly populate: string | string[]
    private readonly createObject?: (req: ReqWithUserId) => Partial<D>

    protected constructor(name: string, model: Model<D>, populate: string | string[],
                          createObject?: (req: ReqWithUserId) => Partial<D>) {
        this.name = name
        this.model = model
        this.populate = populate
        this.createObject = createObject
    }

    get = (req: Request, res: Response) =>
        this.model.findById(req.params.id).populate(this.populate).exec((err, document) => {
            if (err || !document) return errorRes(res, 404, `${this.name} is not found`)

            successRes(res, document)
        })

    getBy = (req: Request, res: Response, conditions: FilterQuery<D>) => {
        this.model.find(conditions).populate(this.populate).exec((err, documents) => {

            if (err || documents.length === 0) return warningRes(res, `No ${this.name.toLowerCase()}`)

            successRes(res, documents)
        })
    }

    Create = (req: ReqWithUserId, res: Response, pre?: () => void, then?: Then<D>) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        if (pre) pre()

        new this.model(this.createObject ? this.createObject(req) : {}).save()
            .then(document => {
                successRes(res, document)

                if (then) then(document)
            })
            .catch(() => errorRes(res, 500, `Can't create ${this.name.toLowerCase()}`))
    }

    Delete = async (req: ReqWithUserId, res: Response, resolveBool?: (d: D) => boolean, then?: Then<D>) => {
        try {
            const document = await this.model.findById(req.params.id)

            if (!document) return errorRes(res, 404, `${this.name} is not found`)

            if ((resolveBool && resolveBool(document)) || req.userId.toString() === document.creator?.toString()) {

                await document.remove()

                successRes(res)

                if (then) then(document)
            } else
                errorRes(res, 403, "You haven't permission for this action")
        } catch (err) {
            errorRes(res, 500, err.message)
        }
    }

    Update = (req: Request, res: Response, then?: Then<D>) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) return warningRes(res, errors.array()[0].msg)

        this.model.findByIdAndUpdate(req.body._id, {...req.body}, (err, document) => {
            if (err || !document) return errorRes(res, 404, `${this.name} is not updated`)

            successRes(res)

            if (then) then(document)
        })
    }
}