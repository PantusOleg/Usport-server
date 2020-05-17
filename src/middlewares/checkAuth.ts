import {Request, Response, NextFunction} from "express"
import {verifyToken} from "../utils/jwtControl"
import {errorRes} from "../utils/utils"

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/api/user/create" || req.path === "/api/user/login") {
        return next()
    }

    try {
        const token = req.headers.token as string

        await verifyToken(token)
        next()
    } catch (err) {
        errorRes(res, 403, err.message)
    }
}