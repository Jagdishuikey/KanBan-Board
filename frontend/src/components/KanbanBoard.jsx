import { useEffect, useState } from "react"
import { socket } from "../socket"
import TaskInput from "./TaskInput"
import TaskList from "./TaskList"
import TaskChart from "./TaskChart"


export default function KanbanBoard() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    socket.on("sync:tasks", (data) => {
      console.log("Tasks from backend:", data)
      setTasks(data)
    })

    return () => socket.off("sync:tasks")
  }, [])

  const addTask = (title) => {
    socket.emit("task:create", {
      id: Date.now(),
      title,
      status: "todo",
    })

  }
  const moveTask = (id, status) => {
    socket.emit("task:move", { id, status })
  }
  const deleteTask = (id) => {
    socket.emit("task:delete", id)
  }



  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kanban Board
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your tasks efficiently</p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* Place for user profile or settings if needed later */}
          </div>
        </header>

        {/* INPUT SECTION */}
        <div className="mb-8">
          <TaskInput onAddTask={addTask} />
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDE: BOARD (3/4 width) */}
          <div className="lg:col-span-3">
            <TaskList
              tasks={tasks}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}

            />
          </div>

          {/* RIGHT SIDE: CHART (1/4 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TaskChart tasks={tasks} />
              {/* Could add other stats or timeline here */}
            </div>
          </div>

        </div>
      </div>
    </div>
  )

}
