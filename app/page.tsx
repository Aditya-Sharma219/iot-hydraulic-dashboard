// app/page.tsx

export default function Home() {
  // Simulated sensor data (we’ll later replace this with real cloud data)
  const machineName = "Hydraulic Rubber Molding Machine - Unit 1";

  const sensorData = {
    temperature: 115, // °C
    pressure: 62,     // bar
    vibration: 0.9,   // g
    cycleCount: 12840,
    status: "Running", // Running | Idle | Error | MaintenanceDue
  };

  const isTempHigh = sensorData.temperature > 120;
  const isPressureHigh = sensorData.pressure > 70;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          IoT Monitoring Dashboard
        </h1>
        <div className="text-sm text-slate-400">
          Project: IoT-Enabled Hydraulic Rubber Molding Machine
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 p-6">
        {/* Machine Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">{machineName}</h2>
          <p className="text-sm text-slate-400">
            Real-time monitoring • Simulated data (will connect to AWS later)
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Temperature
            </h3>
            <p className="text-3xl font-semibold">
              {sensorData.temperature}
              <span className="text-base text-slate-400"> °C</span>
            </p>
            <p className="mt-1 text-xs">
              Status:{" "}
              <span className={isTempHigh ? "text-red-400" : "text-emerald-400"}>
                {isTempHigh ? "High" : "Normal"}
              </span>
            </p>
          </div>

          {/* Pressure */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Pressure
            </h3>
            <p className="text-3xl font-semibold">
              {sensorData.pressure}
              <span className="text-base text-slate-400"> bar</span>
            </p>
            <p className="mt-1 text-xs">
              Status:{" "}
              <span className={isPressureHigh ? "text-red-400" : "text-emerald-400"}>
                {isPressureHigh ? "High" : "Normal"}
              </span>
            </p>
          </div>

          {/* Vibration */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Vibration
            </h3>
            <p className="text-3xl font-semibold">
              {sensorData.vibration}
              <span className="text-base text-slate-400"> g</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Monitoring abnormal spikes in vibration.
            </p>
          </div>

          {/* Cycle Count */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Cycle Count
            </h3>
            <p className="text-3xl font-semibold">
              {sensorData.cycleCount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Used later for predictive maintenance logic.
            </p>
          </div>
        </div>

        {/* Machine Status Bar */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-slate-400">
              Machine Status
            </h3>
            <p className="text-lg font-semibold">
              {sensorData.status}
            </p>
          </div>
          <div className="text-xs text-slate-400">
            This dashboard is currently using simulated data.
            <br />
            In the next steps we will:
            <ul className="list-disc list-inside">
              <li>Send sensor data to AWS (API Gateway + Lambda)</li>
              <li>Store logs in a database</li>
              <li>Visualize real-time + historical trends</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
