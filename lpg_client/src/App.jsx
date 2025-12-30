import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/custom/Navbar.jsx";
import { Toaster } from "sonner";
import { useAuthInit } from "./hooks/useAuthInit.js";

function App() {
  useAuthInit(); // ✅ auth initialization on app mount

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={2500}
      />
    </>
  );
}

export default App;
