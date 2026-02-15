import { useDrag, useDrop } from "react-dnd"

const readFileAsBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })

export default function TaskList({ tasks, onMoveTask, onDeleteTask, onUpdateTask }) {
  const todo = tasks.filter((t) => t.status === "todo")
  const inProgress = tasks.filter((t) => t.status === "inprogress")
  const done = tasks.filter((t) => t.status === "done")




  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Column
        title="To Do"
        tasks={todo}
        status="todo"
        nextStatus="inprogress"
        color="bg-slate-100 dark:bg-slate-900/50"
        headerColor="bg-blue-500"
        onMoveTask={onMoveTask}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
      />

      <Column
        title="In Progress"
        tasks={inProgress}
        status="inprogress"
        nextStatus="done"
        color="bg-slate-100 dark:bg-slate-900/50"
        headerColor="bg-amber-500"
        onMoveTask={onMoveTask}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
      />

      <Column
        title="Done"
        tasks={done}
        status="done"
        color="bg-slate-100 dark:bg-slate-900/50"
        headerColor="bg-green-500"
        onMoveTask={onMoveTask}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
      />
    </div>
  )
}


function Column({ title, tasks, status, nextStatus, color, headerColor, onMoveTask, onDeleteTask, onUpdateTask }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => {
      onMoveTask(item.id, status)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`rounded-xl p-4 min-h-[500px] transition-colors duration-200 border-2 ${isOver
        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
        : "border-transparent " + color
        }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${headerColor}`}></div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">
          {title} <span className="text-slate-400 text-sm font-normal ml-1">({tasks.length})</span>
        </h3>
      </div>

      {tasks.length === 0 && (
        <div className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-sm">
          Drop tasks here
        </div>
      )}

      <ul className="space-y-3">
        {tasks.map((task) => (
          <DraggableTask
            key={task.id}
            task={task}
            nextStatus={nextStatus}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </ul>
    </div>
  )
}


function DraggableTask({ task, nextStatus, onMoveTask, onDeleteTask, onUpdateTask }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const base64 = await readFileAsBase64(file)

    onUpdateTask({
      ...task,
      attachment: {
        name: file.name,
        type: file.type,
        url: base64,
      },
    })
  }


  return (
    <li
      ref={drag}
      className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all duration-200
        ${isDragging ? "opacity-50 scale-95" : "opacity-100"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-800 dark:text-slate-100 font-medium leading-tight">{task.title}</span>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {task.attachment && (
        <div className="mb-2">
          {task.attachment.type.startsWith("image/") ? (
            <img src={task.attachment.url} alt="attachment" className="w-full h-32 object-cover rounded-md border border-slate-100" />
          ) : (
            <a href={task.attachment.url} download={task.attachment.name} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              📎 {task.attachment.name}
            </a>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs text-slate-400 hover:text-blue-500 cursor-pointer flex items-center gap-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="hidden group-hover:inline">Attach</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {nextStatus && (
          <button
            onClick={() => onMoveTask(task.id, nextStatus)}
            className="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            Move
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>
    </li>
  )
}
