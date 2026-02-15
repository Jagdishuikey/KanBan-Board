import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function TaskChart({ tasks }) {
  const data = [
    {
      name: "To Do",
      count: tasks.filter(t => t.status === "todo").length,
    },
    {
      name: "In Progress",
      count: tasks.filter(t => t.status === "inprogress").length,
    },
    {
      name: "Done",
      count: tasks.filter(t => t.status === "done").length,
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
        Task Progress
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
