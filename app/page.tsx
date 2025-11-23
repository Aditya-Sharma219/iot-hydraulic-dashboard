// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Alert {
  type: string;
  message: string;
  timestamp: string;
}

interface Prediction {
  failureProbability: number;
  maintenanceDate: string;
  riskLevel: string;
}

interface Telemetry {
  temperature: number;
  pressure: number;
  vibration: number;
  cycleCount: number;
  status: string;
  timestamp: string;
  alerts?: Alert[];
  prediction?: Prediction;
  history?: any[];
}

export default function Home() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://4f01rfgu43.execute-api.us-east-1.amazonaws.com/prod/telemetry/latest"
        );
        const data = await res.json();
        setTelemetry(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // fallback so UI never breaks
  const t = telemetry ?? {
    temperature: 0,
    pressure: 0,
    vibration: 0,
    cycleCount: 0,
    status: "Offline",
    alerts: [],
    prediction: null,
    history: [],
  };

  const statusColor =
    t.status === "Running"
      ? "text-emerald-400"
      : t.status === "Error"
      ? "text-red-400"
      : t.status === "Idle"
      ? "text-yellow-400"
      : "text-slate-300";

  const format = (num: number | undefined) =>
    num?.toLocaleString() ?? "--";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <section className="flex-1 p-6 space-y-10 animate-in fade-in duration-300 max-w-8xl mx-auto w-full">
        
        {/* Machine title */}
        <header>
          <h2 className="text-3xl font-bold">Hydraulic Rubber Molding Machine</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time cloud monitoring • AWS IoT + AI Predictive Maintenance
          </p>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SensorCard title="Temperature" value={t.temperature} unit="°C" />
          <SensorCard title="Pressure" value={t.pressure} unit="bar" />
          <SensorCard title="Vibration" value={t.vibration} unit="g" />
          <SensorCard title="Cycle Count" value={format(t.cycleCount)} />
        </div>

        {/* Machine Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-medium text-slate-400">Machine Status</h3>
          <div className="flex items-center gap-3 mt-2 text-xl font-semibold">
            <span
              className={`h-3 w-3 rounded-full animate-pulse ${
                t.status === "Running"
                  ? "bg-emerald-400"
                  : t.status === "Error"
                  ? "bg-red-400"
                  : t.status === "Idle"
                  ? "bg-yellow-400"
                  : "bg-slate-500"
              }`}
            />
            {t.status}
          </div>
        </div>

        {/* Graph */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold mb-4">Telemetry Graph (Live)</h3>
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={t.history ?? []}>
              <XAxis dataKey="timestamp" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#f43f5e" strokeWidth={2.4} dot />
              <Line type="monotone" dataKey="pressure" stroke="#38bdf8" strokeWidth={2.4} dot />
              <Line type="monotone" dataKey="vibration" stroke="#a78bfa" strokeWidth={2.4} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold mb-4">Alerts</h3>
          {t.alerts?.length ? (
            <div className="space-y-2">
              {t.alerts.map((a, idx) => (
                <div key={idx} className="p-3 rounded-md bg-red-950/40 border border-red-600/30">
                  <span className="font-semibold text-red-400">{a.type}</span> — {a.message}
                  <span className="text-xs text-slate-400 ml-2">{a.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No active alerts 🎉</p>
          )}
        </div>

        {/* AI Prediction */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold mb-4">AI Predictive Maintenance</h3>

          {!t.prediction ? (
            <p className="text-slate-400 text-sm">⏳ AI analyzing data...</p>
          ) : (
            <div className="space-y-4">
              {/* Badge */}
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-lg inline-block ${
                  t.prediction.riskLevel === "High"
                    ? "bg-red-600/30 text-red-300"
                    : t.prediction.riskLevel === "Moderate"
                    ? "bg-yellow-500/30 text-yellow-200"
                    : "bg-emerald-600/30 text-emerald-300"
                }`}
              >
                🔥 Risk Level: {t.prediction.riskLevel}
              </span>

              {/* Probability */}
              <p className="text-sm font-medium">
                Failure Probability:
                <span className="ml-2 font-bold text-lg">
                  {t.prediction.failureProbability}%
                </span>
              </p>

              {/* Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full shadow-inner overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    t.prediction.failureProbability >= 65
                      ? "bg-red-500"
                      : t.prediction.failureProbability >= 30
                      ? "bg-yellow-400"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${t.prediction.failureProbability}%` }}
                />
              </div>

              {/* Maintenance Date */}
              <p className="text-sm font-medium">
                Recommended Maintenance:
                <span className="ml-2 text-blue-300 underline font-semibold">
                  {t.prediction.maintenanceDate}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* Card Component */
function SensorCard({
  title,
  value,
  unit = "",
}: {
  title: string;
  value: any;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-md hover:shadow-[0_0_12px_#6c47ff66] transition">
      <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
      <p className="text-4xl font-bold">
        {value ?? "--"}
        {unit && <span className="text-base text-slate-400"> {unit}</span>}
      </p>
    </div>
  );
}
