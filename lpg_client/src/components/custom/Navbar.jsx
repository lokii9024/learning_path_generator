import React, { useState, useRef, useEffect } from "react";

/**
 * NavbarPolaris.jsx
 * Design-first navbar for Polaris (Nordic Navigator).
 *
 * Props:
 *  - isLoggedIn (bool) — controls which set of links to show (default: false)
 *  - userName (string) — used for avatar initials when logged in (optional)
 *
 * Behavior:
 *  - local UI toggles only: mobile menu open/close, profile dropdown open/close.
 *  - All links use demo href="#" (replace later with router/handlers).
 *
 * This component intentionally contains NO navigation/business logic.
 */

export default function NavbarPolaris({ isLoggedIn = false, userName = "PV" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside (small, UI-only behavior)
  useEffect(() => {
    function onDoc(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // helper to render avatar initials
  function initials(name) {
    if (!name) return "PV";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{
        background: "linear-gradient(180deg, var(--color-primary), var(--color-primary))",
        color: "#fff",
        backdropFilter: "saturate(120%) blur(6px)",
      }}
      aria-label="Polaris top navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo (left) */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 no-underline" aria-label="Polaris home">
              <div
                className="rounded-lg flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  background: "var(--color-bg-card)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-soft)",
                  border: "1px solid rgba(26,83,92,0.05)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="var(--color-primary)"></path>
                  <circle cx="12" cy="12" r="2.1" fill="var(--color-accent)"></circle>
                </svg>
              </div>

              <div className="leading-tight">
                <div
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  Polaris
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>Learning Paths</div>
              </div>
            </a>
          </div>

          {/* Right: desktop links */}
          <div className="hidden md:flex items-center gap-3">
            <a className="nav-link text-sm text-white/90" href="#">Home</a>

            {!isLoggedIn ? (
              <>
                <a className="nav-link text-sm text-white/80" href="#">Sign Up</a>
                <a className="nav-link text-sm text-white/80" href="#">Login</a>
              </>
            ) : (
              <>
                <a className="nav-link text-sm text-white/80" href="#">Generate Path</a>
                <a className="nav-link text-sm text-white/80" href="#">All Paths</a>

                {/* Profile + dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="avatar inline-flex items-center justify-center ml-1"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((s) => !s)}
                    title="Open profile menu"
                    type="button"
                  >
                    {initials(userName)}
                  </button>

                  {/* Dropdown (visual only) */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-44 rounded-md shadow-sm"
                      style={{ background: "var(--color-bg-card)", border: "1px solid rgba(26,83,92,0.06)" }}
                    >
                      <div style={{ padding: 8 }}>
                        <a href="#" className="block px-3 py-2 text-sm font-semibold text-slate-800">Profile</a>
                        <a href="#" className="block px-3 py-2 text-sm text-slate-700">Settings</a>
                        <div className="border-t mt-1" style={{ borderColor: "rgba(26,83,92,0.06)" }} />
                        <a href="#" className="block mt-2 px-3 py-2 text-sm font-medium" style={{ color: "var(--color-primary)" }}>Logout</a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: mobile / small screens */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile menu button: toggles visual mobile menu */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Open menu"
              className="inline-flex items-center justify-center p-2 rounded-md btn-ghost"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu (visual) */}
        {mobileOpen && (
          <div className="mt-3 md:hidden">
            <div className="mobile-menu">
              <div className="flex flex-col gap-2">
                <a className="block px-3 py-2 rounded text-sm font-semibold text-gray-800" href="#">Home</a>

                {!isLoggedIn ? (
                  <>
                    <a className="block px-3 py-2 rounded text-sm text-gray-700" href="#">Sign Up</a>
                    <a className="block px-3 py-2 rounded text-sm text-gray-700" href="#">Login</a>
                  </>
                ) : (
                  <>
                    <a className="block px-3 py-2 rounded text-sm text-gray-700" href="#">Generate Path</a>
                    <a className="block px-3 py-2 rounded text-sm text-gray-700" href="#">All Paths</a>

                    <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(26,83,92,0.06)" }}>
                      <div className="flex items-center gap-3">
                        <div className="avatar" style={{ width: 44, height: 44 }}>{initials(userName)}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{userName || "Polaris User"}</div>
                          <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Member</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <a className="block px-3 py-2 rounded text-sm font-medium" href="#" style={{ color: "var(--color-primary)" }}>Logout</a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
