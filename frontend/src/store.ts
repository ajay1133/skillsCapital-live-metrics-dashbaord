import {create } from 'zustand'
export type Metric = {
  serviceName:string
  cpu:number
  memory:number
  errorRate:number
}
export type MetrcsState = {
  metrics:Record<string, Metric[]>
  services:string[]
  setServices:(services: string[]) => void
  setMetric:(metric: Metric[]) => void
  clear:()=>void
}
export const useMetricsStore = create<MetrcsState>((set) => ({
  metrics:{},
  services:[],
  setServices:(services) =>
    set((state) => {
      const nxt: Record<string, Metric[]> = {}
      for (const s of services){
        nxt[s]=state.metrics[s] || []
      }
      return {services, metrics: nxt}
}),
  setMetric:(metricArr)=>
    set((state)=>{
      const nxt = {...state.metrics}
      for (const m of metricArr) {
        const arr = nxt[m.serviceName] || []
        nxt[m.serviceName] = [...arr.slice(-29), m]
      }
      return {metrics: nxt}
    }),
  clear:()=>set({ metrics: {}})
}))