import cloudinary from "../core/cloudinary"
import {Response} from "express"
import {FileModel} from "../models/File"
import {errorRes, successRes, warningRes} from "../utils/utils"
import {ReqWithUserId} from "../middlewares/checkAuth"

export default class FileService {

    static create = async (req: ReqWithUserId, res: Response) => {
        try {
            const result = await cloudinary.v2.uploader.upload(`data:${req.body.type};base64,${req.body.base64}`, {
                resource_type: "auto"
            })

            if (!result) return warningRes(res, "Server can't upload file")

            await new FileModel({
                uri: result.url,
                public_id: result.public_id,
                type: req.body.type,
                creator: req.userId,
            }).save((err, file) => {
                if (err || !file) return warningRes(res, "Can't save file")

                successRes(res, file)
            })
        } catch (err) {
            warningRes(res, "Server can't upload file")
        }
    }

    static delete = (req: ReqWithUserId, res: Response) =>
        FileModel.findById(req.body.id, (err, file) => {
            if (err || !file) return errorRes(res, 403, "File is not found")

            cloudinary.v2.uploader.destroy(req.body.public_id).then(() => {
                if (req.userId.toString() === file.creator.toString())
                    file.remove()
                        .then(() => successRes(res, null, "File is deleted"))
                        .catch(err => errorRes(res, 500, err.message))

                else errorRes(res, 403, "You haven't permission to this action")
            }).catch(() => warningRes(res, "Can't delete file"))
        })

}
