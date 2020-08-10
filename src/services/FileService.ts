import cloudinary from "../core/cloudinary"
import {Response} from "express"
import {FileModel} from "../models/File"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {ReqWithUserId} from "../middlewares/checkAuth"

export default class FileService {

    static create = async (req: ReqWithUserId, res: Response) => {
        try {
            const {type, base64} = req.body

            const result = await cloudinary.v2.uploader.upload(`data:${type};base64,${base64}`, {
                resource_type: "auto", folder: req.userId
            })

            if (!result) return warningRes(res, "Server can't upload file")

            await new FileModel({
                uri: result.url,
                public_id: result.public_id,
                type,
                hwRatio: result.height / result.width,
                creator: req.userId,
            }).save((err, file) => {
                if (err || !file) return warningRes(res, "Can't save file")

                successRes(res, file)
            })
        } catch (err) {
            warningRes(res, err.message)
        }
    }

    static delete = (req: ReqWithUserId, res: Response) =>
        FileModel.findById(req.params.id, (err, file) => {
            if (err || !file) return errorRes(res, 403, "File is not found")

            if (req.userId.toString() === file.creator.toString()) {
                cloudinary.v2.uploader.destroy(file.public_id).then(() => {
                    file.remove()
                        .then(() => successRes(res, null, "File is deleted"))
                        .catch(err => errorRes(res, 500, err.message))
                }).catch(() => warningRes(res, "Can't delete file"))
            } else
                errorRes(res, 403, "You haven't permission to this action")
        })

}
