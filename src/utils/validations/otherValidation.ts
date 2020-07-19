import {check} from "express-validator"

export const trainingValidation = [
    check("creator").notEmpty().isString(),
    check("name").isString().isLength({min: 5, max: 200})
        .withMessage("Name should be a string 5-200 symbols length"),
    check("exercises").notEmpty().isArray(),
    check("attachments").isArray(),
    check("sports").isArray(),
    check("tempo").isNumeric()
]

export const chatValidation = [
    check("members").isArray(),
    check("photo").isString(),
    check("dialogs").isArray()
]

export const dialogValidation = [
    check(["name", "goal"]).isString()
]

export const messageValidation = [
    check(["dialog", "text", "chat"]).isString(),
    check("attachments").isArray()
]