import {Document, SchemaTimestampsConfig} from "mongoose"

export interface DocWithTimeStamps extends Document {
    createdAt: SchemaTimestampsConfig["createdAt"]
    updatedAt: SchemaTimestampsConfig["updatedAt"]
}