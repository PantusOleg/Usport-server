import express from "express"
import dotenv from "dotenv"

dotenv.config()

import "./core/db/db"
import {useRoutes} from "./core/router"
import {createServer} from "http"
import {useSockets} from "./core/socket"

const app = express()
const http = createServer(app)
const io = useSockets(http)

useRoutes(app, io)

http.listen(process.env.PORT, () => console.log(`I am started on port ${process.env.PORT}`))
