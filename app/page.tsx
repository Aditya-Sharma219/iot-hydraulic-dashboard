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

  const loading = telemetry === null;
  const machineName = "Hydraulic Rubber Molding Machine - Unit 1";

  const statusColor =
    telemetry?.status === "Running"
      ? "text-emerald-400"
      : telemetry?.status === "Idle"
        ? "text-yellow-400"
        : telemetry?.status === "Error"
          ? "text-red-400"
          : "text-slate-300";

  const format = (num: number | undefined) => num?.toLocaleString() ?? "...";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <section className="flex-1 p-6 space-y-8 animate-in fade-in duration-300">

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">{machineName}</h2>
          <p className="text-sm text-slate-400">
            Real-time monitoring • LIVE Cloud Data
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard title="Temperature" value={telemetry?.temperature} unit="°C" />
          <SensorCard title="Pressure" value={telemetry?.pressure} unit="bar" />
          <SensorCard title="Vibration" value={telemetry?.vibration} unit="g" />
          <SensorCard title="Cycle Count" value={format(telemetry?.cycleCount)} />
        </div>

        {/* Machine Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-medium text-slate-400">Machine Status</h3>
          <div className="flex items-center gap-2 text-xl font-semibold mt-1">
            <span
              className={`h-3 w-3 rounded-full animate-pulse ${telemetry?.status === "Running"
                ? "bg-emerald-400"
                : telemetry?.status === "Error"
                  ? "bg-red-400"
                  : telemetry?.status === "Idle"
                    ? "bg-yellow-400"
                    : "bg-slate-500"
                }`}
            />
            {loading ? "..." : telemetry?.status}
          </div>
        </div>

        {/* Graph */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold mb-4">Live Telemetry Graphs</h3>
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={telemetry?.history ?? []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="timestamp" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f43f5e"
                strokeWidth={2.4}
                dot={{ r: 5, stroke: "#f43f5e", strokeWidth: 3, fill: "#1e1b2e" }}
              />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#38bdf8"
                strokeWidth={2.4}
                dot={{ r: 5, stroke: "#38bdf8", strokeWidth: 3, fill: "#1e1b2e" }}
              />
              <Line
                type="monotone"
                dataKey="vibration"
                stroke="#a78bfa"
                strokeWidth={2.4}
                dot={{ r: 5, stroke: "#a78bfa", strokeWidth: 3, fill: "#1e1b2e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold mb-4">Alerts</h3>
          {telemetry?.alerts?.length ? (
            <div className="space-y-2">
              {telemetry.alerts.map((alert, i) => (
                <div
                  key={i}
                  className="p-3 rounded-md bg-red-950/40 border border-red-700/30 shadow-sm shadow-red-500/10 text-sm"
                >
                  <span className="text-red-400 font-semibold">{alert.type}</span> — {alert.message}
                  <span className="text-xs text-slate-400 ml-2">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No active alerts 🎉</p>
          )}
        </div>

        {/* AI Prediction */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold mb-4">Predictive AI — Maintenance</h3>

          {telemetry?.prediction ? (
            <div className="space-y-4">
              {/* Risk Label */}
              <div
                className={`px-4 py-2 rounded-lg font-semibold text-sm inline-block ${telemetry.prediction.riskLevel === "High"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : telemetry.prediction.riskLevel === "Moderate"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}
              >
                🔥 Risk Level: {telemetry.prediction.riskLevel}
              </div>

              {/* Failure Probability */}
              <p className="text-sm font-medium">
                Failure Probability:
                <span
                  className={`font-bold ml-1 ${telemetry.prediction.failureProbability >= 65
                      ? "text-red-400"
                      : telemetry.prediction.failureProbability >= 30
                        ? "text-yellow-400"
                        : "text-emerald-400"
                    }`}
                >
                  {telemetry.prediction.failureProbability}%
                </span>
              </p>

              {/* Risk Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-700 ${telemetry.prediction.failureProbability >= 65
                      ? "bg-red-500"
                      : telemetry.prediction.failureProbability >= 30
                        ? "bg-yellow-400"
                        : "bg-emerald-400"
                    }`}
                  style={{ width: `${telemetry.prediction.failureProbability}%` }}
                ></div>
              </div>

              {/* Maintenance Date */}
              <p className="text-sm font-medium">
                Maintenance Date:
                <span className="ml-2 text-base font-bold text-blue-300 underline tracking-wide">
                  {telemetry.prediction.maintenanceDate}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">⏳ AI is analyzing machine health...</p>
          )}
        </div>

      </section>
    </main>
  );
}

/* Sensor Card Component */
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-md hover:shadow-[0_0_15px_#6c47ff55] transition cursor-default">
      <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
      <p className="text-4xl font-semibold tracking-tight">
        {value ?? "--"}
        {unit && <span className="text-base text-slate-400"> {unit}</span>}
      </p>
    </div>
  );
}
