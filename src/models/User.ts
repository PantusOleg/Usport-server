import mongoose, {Document, Model, Schema} from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import {generateHash, isRequired} from "../utils/utils"
import {differenceInMinutes} from "date-fns"
import isEmail = validator.isEmail

interface UserSchema extends Document {
    email: string
    userName: string
    avatar?: string
    fullName: string
    about: string
    sports: Array<Sports>
    password: string
    lastSeen: Date
    isOnline: boolean
    confirmed: boolean
    confirmHash?: string
    birthDate: Date
}

export enum Sports {
    VOLLEYBALL,
    BASKETBALL,
    FOOTBALL,
    TENNIS
}

export interface IUser extends UserSchema {
    isOnline: boolean
}

interface IUserModel extends Model<IUser> {
    comparePasswords(id: string, password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: isRequired("Email"),
        validate: [isEmail, "Invalid email"],
        unique: true
    },
    userName: {
        type: String,
        required: isRequired("UserName"),
        unique: true
    },
    avatar: String,
    fullName: {
        type: String,
        required: isRequired("Full name")
    },
    about: {
        type: String,
        maxlength: 100
    },
    sports: [Number],
    password: {
        type: String,
        required: isRequired("Password"),
        select: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmHash: String,
    birthDate: {
        type: Date,
        required: isRequired("Birth date")
    },
}, {versionKey: false})

UserSchema.virtual("isOnline").get(function (this: UserSchema) {
    return differenceInMinutes(Date.now(), this.lastSeen) < 5
})

UserSchema.set("toJSON", {virtuals: true})

UserSchema.pre<IUser>("save", async function (next) {

    if (!this.isModified("password")) return next()

    try {
        this.password = await generateHash(this.password)
        this.confirmHash = await generateHash(Date.now().toString().slice(0, 7))
    } catch (err) {
        console.log(err.message || err)
    }
})

UserSchema.statics.comparePasswords = async function (id: string, inputPassword: string) {
    try {
        const {password} = await this.findById(id).select("password")
        return bcrypt.compareSync(inputPassword, password)
    } catch (err) {
        return false
    }
}

export const UserModel = mongoose.model<IUser, IUserModel>("User", UserSchema)