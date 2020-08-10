import socket from "socket.io"
import {Server} from "http"

export function useSockets(http: Server) {
    const io = socket(http)

    io.on("connection", function (socket) {

        socket.on("CHAT/JOIN", chatId => {
            socket.join(chatId)
        })

        socket.on("disconnect", () => {})
    })

    return io
}