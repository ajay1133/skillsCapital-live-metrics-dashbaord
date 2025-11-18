import React from "react";
import { Metric } from "./store";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from "recharts";

export default function ServiceModal({ 
  serviceName, metrics, onClose 
}: { 
  serviceName: string; metrics: Metric[]; onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">{serviceName} - Last 30s</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics}>
            <XAxis dataKey="serviceName" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="cpu" stroke="#3b82f6" dot={false} name="CPU" />
            <Line type="monotone" dataKey="memory" stroke="#10b981" dot={false} name="Memory" />
            <Line type="monotone" dataKey="errorRate" stroke="#ef4444" dot={false} name="Error Rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
