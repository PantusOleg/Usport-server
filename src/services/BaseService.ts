import {Request, Response} from "express"

export interface BaseService {
    getById(req: Request, res: Response): void

    create(req: Request, res: Response): void

    delete(req: Request, res: Response): void

    update(req: Request, res: Response): void
}
