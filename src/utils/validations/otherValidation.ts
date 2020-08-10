import {check} from "express-validator"

export const trainingValidation = [
    check("creator").notEmpty().isString(),
    check("name").isString().isLength({min: 5, max: 200})
        .withMessage("Name should be a string 5-200 symbols length"),
    check("exercises").notEmpty().isArray(),
    check("attachments").isArray(),
    check("sports").isArray()
]

export const chatValidation = [
    check("members").isArray(),
    check("lastMessage").isString(),
    check("photo").optional().isString()
]

export const messageValidation = [
    check("chat").isString(),
    check("text").optional().isString().isLength({min: 0, max: 300})
        .withMessage("Max length is 300"),
    check("attachments").optional().isArray()
]