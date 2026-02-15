import { useState } from "react"

export default function TaskInput({ onAddTask }) {
  const [title, setTitle] = useState("")

  const handleAdd = () => {
    if (!title.trim()) return
    onAddTask(title)
    setTitle("")
  }

  return (
    <div className="flex gap-3 mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <input
        className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:text-white"
        placeholder="Enter a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button
        onClick={handleAdd}
        disabled={!title.trim()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
      >
        <span>Add Task</span>
        <span className="text-xl leading-none">+</span>
      </button>
    </div>
  )
}
