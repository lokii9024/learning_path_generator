import React from "react";

// Minimal Polaris status page — no scroll, centered, clean
// Paste into your Vite + React project (e.g., App.jsx)

export default function PolarisStatus() {
  const backendRepo = "https://github.com/lokii9024/learning_path_generator"; // replace
  const frontendRepo = "https://github.com/lokii9024/learning_path_generator"; // replace

  return (
    <main
      className="h-screen w-screen overflow-hidden flex items-center justify-center bg-slate-900 text-slate-100"
    >
      <div className="text-center p-6 bg-slate-800/70 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold tracking-tight">Polaris</h1>
        <p className="mt-3 text-lg text-slate-300">Frontend in Progress</p>
        <p className="mt-1 text-md text-slate-400">Backend is Ready 🚀</p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={backendRepo}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium"
          >
            View Backend Code
          </a>

          <a
            href={frontendRepo}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition text-slate-200"
          >
            View Frontend Repo
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-500">More updates coming soon.</p>
      </div>
    </main>
  );
}