import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const {isLoggedIn} = useSelector((state) => state.auth);
  
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-[#F7F9F9] px-6">
      <div className="max-w-3xl text-center">

        {/* Tagline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1A535C]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Learn with clarity.<br />
          Build your perfect learning path.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base md:text-lg text-[#2D3436] opacity-90 max-w-2xl mx-auto">
          A guided way to master anything — curated videos, repos, and real projects,
          delivered in a sequence that makes learning effortless.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            onClick={() => navigate(isLoggedIn ? "/generate-path" : "/signin")}
            className="px-8 py-3 rounded-xl text-sm font-semibold shadow-md cursor-pointer"
            style={{
              background: "#F7B801",
              color: "#111",
              boxShadow: "0 8px 24px rgba(247,184,1,0.12)",
            }}
          >
            Get Started
          </a>

          <a
            onClick={() => navigate(isLoggedIn ? "/user/my-paths" : "/signin")}
            className="px-7 py-3 rounded-xl text-sm font-medium border border-[#1A535C] text-[#1A535C] hover:bg-[#e9f2f2] transition cursor-pointer"
          >
            Browse Paths
          </a>
        </div>

        {/* Small subtle tagline */}
        <p className="mt-6 text-xs text-[#636E72]">
          No distractions. No confusion. Just progress.
        </p>
      </div>
    </section>
  );
}
