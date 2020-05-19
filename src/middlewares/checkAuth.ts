import {Request, Response, NextFunction} from "express"
import {verifyToken} from "../utils/jwtControl"
import {errorRes} from "../utils/utils"

export interface ReqWithUserId extends Request {
    userId: string
}

export const checkAuth = async (req: ReqWithUserId, res: Response, next: NextFunction) => {
    if (req.path === "/api/user/create" || req.path === "/api/user/login") {
        return next()
    }

    try {
        const token = req.headers.token as string

        const {id} = await verifyToken(token) as { id: string }
        if (req.url === "/api/event/delete") req.userId = id

        next()
    } catch (err) {
        errorRes(res, 403, err.message)
    }
}