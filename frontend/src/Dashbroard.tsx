import {useState, useCallback} from 'react'
import {useMetricsStore} from './store'
import SrvcCard from './SrvcCard'
import SrvcModal from './SrvcModal'

const { 
  VITE_BACKEND_BASE_URL = 'http://localhost:3000'
} = (import.meta as any)?.env || {};

export default function Dashbroard({connected}:any) {
  const metrics = useMetricsStore((s)=>s.metrics)
  const services = useMetricsStore((s)=>s.services)
  const [selected,setSelected] = useState<string|null>(null)

  const handleAdd = useCallback(async ()=>{
    try {
      await fetch(`${VITE_BACKEND_BASE_URL}/config?n=${services.length + 1}`);
    } catch (e) {
      console.error(e);
    }  
  },[services.length])
  const handleRemove = useCallback(async ()=>{
    if (services.length > 1) {
      try {
        await fetch(`${VITE_BACKEND_BASE_URL}/config?n=${services.length - 1}`);
      } catch (e) {
        console.error(e);
      }  
    }
  },[services.length])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center mb-4 gap-4">
        <span className={connected ? "text-green-600" : "text-red-600"}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleAdd}>
          Add Service
        </button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleRemove}>
          Remove Service
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
          services.map((name)=>{
            const arr = metrics[name]|| []
            const last = arr[arr.length - 1] || { 
              serviceName: name, 
              cpu: 0, memory: 0, errorRate: 0 
            }
            return <SrvcCard 
              key={name} 
              metric={last} 
              onClick={()=>setSelected(name)} 
            />
          })
        }
      </div>
      {
        selected && (
        <SrvcModal
          serviceName={selected}
          metrics={metrics[selected] || []}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}