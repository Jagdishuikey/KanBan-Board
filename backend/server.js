import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" },
})

let tasks = []

io.on("connection", (socket) => {
  console.log("User connected")

  socket.emit("sync:tasks", tasks)

  socket.on("task:create", (task) => {
    tasks.push(task)
    io.emit("sync:tasks", tasks)
  })
  socket.on("task:move", ({ id, status }) => {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, status } : task
    )
    io.emit("sync:tasks", tasks)
  })
  socket.on("task:delete", (id) => {
  tasks = tasks.filter(task => task.id !== id)
  io.emit("sync:tasks", tasks)
})
socket.on("task:update", (updatedTask) => {
  tasks = tasks.map(task =>
    task.id === updatedTask.id ? updatedTask : task
  )
  io.emit("sync:tasks", tasks)
})



})

server.listen(5000, () => {
  console.log("Backend running on port 5000")
})
