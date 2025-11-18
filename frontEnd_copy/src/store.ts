import { create } from "zustand";

export type Metric = {
  serviceName: string;
  cpu: number;
  memory: number;
  errorRate: number;
};

export type MetrcsState = {
  metrics: Record<string, Metric[]>;
  services: string[];
  setServices: (services: string[]) => void;
  setMetric: (metric: Metric[]) => void;
  clear: () => void;
};

export const useMetricsStore = create<MetrcsState>((set) => ({
  metrics: {},
  services: [],
  setServices: (services) =>
    set((state) => {
      const next: Record<string, Metric[]> = {};
      for (const s of services) {
        next[s] = state.metrics[s] || [];
      }
      return { services, metrics: next };
}),
  setMetric: (metricArr) =>
    set((state) => {
      const next = { ...state.metrics };
      for (const m of metricArr) {
        const arr = next[m.serviceName] || [];
        next[m.serviceName] = [...arr.slice(-29), m ];
      }
      return { metrics: next }
    }),
  clear: () => set({ metrics: {} })
}));
