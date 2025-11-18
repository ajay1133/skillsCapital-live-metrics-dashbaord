import React from "react";
import { Metric } from "./store";

function getAlertColor(cpu: number, errRate: number) {
  if (cpu > 80 || errRate > 5) return "bg-red-500";
  if (cpu > 60) return "bg-yellow-400";
  return 'bg-green-500'
}


export default function ServiceCard({ metric, onClick }: { metric: Metric; onClick: () => void }) {
  return (
    <div
      className="rounded shadow bg-white p-4 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full 
          ${getAlertColor(metric.cpu, metric.errorRate)}`}
        ></div>
        <span className="font-bold text-lg">{metric.serviceName}</span>
      </div>
      <div className="text-sm">CPU: {metric.cpu}%</div>
      <div className="text-sm">Memory: {metric.memory}%</div>
      <div className="text-sm">Error Rate: {metric.errorRate}%</div>
    </div>
  );
}
