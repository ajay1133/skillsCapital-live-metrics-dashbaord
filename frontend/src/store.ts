import {create } from 'zustand'

export const useMetricsStore = create<any>((set: Function) => ({
  metrics:{},
  services:[],
  setServices: (services: any) => {
    const setMetricState = (state: any) => {
      const nxt: Record<string, any[]> = {}
      for (const s of services){
        nxt[s] = s in state.metrics ? state.metrics[s] || [] : [];
      }
      return {services, metrics: nxt}
    }; 
    return set(setMetricState);
  },
  setMetric: (metricsArr: any) => {
    const setMetricState = (state: any) => {
      const {metrics = {}} = state || {};
      const nxt = {...metrics}
      if (Array.isArray(metricsArr)) {
        for (const m of metricsArr) {
          // console.log(m)
          const arr = nxt[m.serviceName] || []
          nxt[m.serviceName] = [
            ...arr.slice(-29), 
            m
          ]
        }
      }
      return {metrics: nxt}
    };
    return set(setMetricState);
  },
  clear:()=>set({ metrics: {} })
}))