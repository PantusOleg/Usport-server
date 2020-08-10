import {Document, Model, SchemaTimestampsConfig} from "mongoose"
import {IEvent} from "./models/Event"
import {ITraining} from "./models/Training"

export interface DocWithTimeStamps extends Document {
    createdAt: SchemaTimestampsConfig["createdAt"]
    updatedAt: SchemaTimestampsConfig["updatedAt"]
}

export interface UserSchema extends Document {
    email: string
    userName: string
    avatar?: string
    fullName: string
    about: string
    sports: Sports[]
    password: string
    lastSeen: Date
    isOnline: boolean
    confirmHash?: string
    savedEvents: (string | IEvent)[]
    savedTrainings: (string | ITraining)[]
    birthDate: Date
    friends: (IUser | string)[]
}

export enum Sports {
    VOLLEYBALL,
    BASKETBALL,
    FOOTBALL,
    TENNIS
}

export interface IUser extends UserSchema {
    isOnline: boolean
    confirmed: boolean
    friendsCount: number
}

export interface IUserModel extends Model<IUser> {
    comparePasswords(id: string, password: string): Promise<boolean>

    findWithSaved(id: string): Promise<IUser>
}