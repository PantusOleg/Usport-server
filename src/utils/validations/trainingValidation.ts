import {check} from "express-validator"

export const trainingValidation = [
    check("creator").notEmpty().isString(),
    check("exercises").notEmpty().isArray(),
    check("attachments").isArray()
]
