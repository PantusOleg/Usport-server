import {check} from "express-validator"

export const eventValidation = [
    check("title").notEmpty().isString().isLength({min: 3, max: 50}),
    check("description").notEmpty().isString().isLength({min: 5, max: 100}),
    check("location").notEmpty().custom(location => {
        const {latitude, longitude, latitudeDelta, longitudeDelta} = location

        if (!latitude || !longitude || !latitudeDelta || !longitudeDelta)
            return Promise.reject("Incorrect location")

        else return true
    }),
    check("attachments").isArray(),
    check("sports").isArray(),
    check("filterMembers").notEmpty().isBoolean(),
    check("date").notEmpty().custom(date => {
        if (new Date(date) instanceof Date) return true
        else return Promise.reject("Incorrect date")
    })
]