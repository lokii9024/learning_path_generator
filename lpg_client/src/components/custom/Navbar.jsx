// src/components/NavbarPolaris.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* shadcn/ui primitives - use your project's implementations */
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * NavbarPolaris
 * Props:
 *  - isLoggedIn (bool)
 *  - userName (string)
 *  - isPro (bool) -> shows Pro / Free text beside avatar
 *  - onLogout (fn)
 *  - onUpgrade (fn) - optional callback for upgrade actions
 */
export default function NavbarPolaris({
  isLoggedIn = false,
  userName = "PV",
  isPro = false,
  onLogout = () => console.log("logout"),
  onUpgrade = () => console.log("upgrade plan"),
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // disable body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close dropdown on outside click
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (drawerRef.current && !drawerRef.current.contains(event.target) && 
        !event.target.closest('[data-drawer-button]')) {
      setDrawerOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  function initials(name) {
    if (!name || typeof name !== 'string') return "PV";
    return name
      .split(" ")
      .map((s) => s?.[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function navTo(path) {
    setDrawerOpen(false);
    navigate(path);
  }

  function handleLogout() {
    setDrawerOpen(false);
    setDropdownOpen(false);
    onLogout();
    navigate("/");
  }

  function handleUpgrade() {
    setDrawerOpen(false);
    setDropdownOpen(false);
    onUpgrade();
    // You can navigate to upgrade page or show modal
    navigate("/upgrade");
  }

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/generate-path", label: "Generate Path", requiresAuth: true },
    { path: "/user/my-paths", label: "My Paths", requiresAuth: true },
  ];

  const theme = {
    primary: "#1A535C",
    secondary: "#F7B801",
    accent: "#FF6B6B",
    lightBg: "#F7F9F9",
    textLight: "#FFFFFF",
    textDark: "#1A535C",
    hoverBg: "rgba(255, 255, 255, 0.1)",
  };

  return (
    <>
      <header
        className="w-full sticky top-0 z-50 transition-all duration-200"
        aria-label="Polaris top navigation"
        style={{
          background: isScrolled 
            ? `linear-gradient(180deg, ${theme.primary}ee, ${theme.primary}ee)`
            : `linear-gradient(180deg, ${theme.primary}, ${theme.primary})`,
          color: theme.textLight,
          backdropFilter: isScrolled ? "saturate(120%) blur(10px)" : "none",
          borderBottom: `1px solid ${isScrolled ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo (left) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-3 p-0 hover:bg-transparent hover:opacity-90 transition-opacity"
              aria-label="Go to homepage"
            >
              <div
                className="rounded-lg flex items-center justify-center transition-transform hover:scale-105"
                style={{
                  width: 44,
                  height: 44,
                  background: theme.lightBg,
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(26,83,92,0.12)",
                  border: "1px solid rgba(26,83,92,0.08)",
                }}
                aria-hidden
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill={theme.primary} />
                  <circle cx="12" cy="12" r="2.1" fill={theme.secondary} />
                </svg>
              </div>

              <div className="leading-tight text-left hidden sm:block">
                <div
                  className="font-bold tracking-tight"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "clamp(16px, 2vw, 18px)",
                    lineHeight: 1,
                  }}
                >
                  Polaris
                </div>
                <div style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "rgba(255,255,255,0.85)" }}>
                  Learning Paths
                </div>
              </div>
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
            {navLinks.map((link) => {
              if (link.requiresAuth && !isLoggedIn) return null;
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  variant="ghost"
                  onClick={() => navigate(link.path)}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "text-white bg-white/10" 
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Button>
              );
            })}
          </nav>

          {/* Right side - Auth/Profile */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signup")}
                  className="hidden sm:inline-flex text-white/80 hover:text-white hover:bg-white/5 text-sm"
                >
                  Sign Up
                </Button>
                <Button
                  onClick={() => navigate("/signin")}
                  className="text-sm px-4 py-2 rounded-lg"
                  style={{
                    background: theme.secondary,
                    color: theme.textDark,
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                {/* Upgrade button for free users (desktop) */}
                {!isPro && (
                  <Button
                    onClick={handleUpgrade}
                    className="hidden lg:inline-flex text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`,
                      color: theme.textDark,
                      boxShadow: "0 4px 15px rgba(247, 184, 1, 0.3)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                        fill="currentColor" />
                    </svg>
                    Upgrade to Pro
                  </Button>
                )}

                {/* Profile dropdown (desktop) */}
                <div className="relative" ref={dropdownRef}>
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="inline-flex items-center gap-2 lg:gap-3 hover:bg-white/5 rounded-lg"
                        aria-label="User menu"
                      >
                        <Avatar className="w-9 h-9 border-2 border-white/20 relative">
                          {!isPro && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                  fill="white" />
                              </svg>
                            </div>
                          )}
                          <AvatarFallback 
                            className="bg-white text-[#1A535C] font-semibold"
                            style={{ borderRadius: 10 }}
                          >
                            {initials(userName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="text-left hidden lg:block">
                          <div style={{ fontSize: 14, fontWeight: 600 }} className="truncate max-w-[120px]">
                            {userName}
                          </div>
                          <div className="flex items-center gap-1">
                            <div 
                              className={`text-xs ${isPro ? 'text-[#F7B801] font-semibold' : 'text-white/70'}`}
                              style={{ fontSize: 11 }}
                            >
                              {isPro ? "Pro Plan" : "Free Plan"}
                            </div>
                            {!isPro && (
                              <Badge 
                                variant="outline"
                                className="ml-1 text-[10px] px-1.5 py-0 h-4 border-white/30 text-white/90"
                              >
                                Upgrade
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent 
                      side="bottom" 
                      align="end" 
                      className="w-52 mt-2 p-1 rounded-xl"
                      style={{ 
                        border: `1px solid rgba(26,83,92,0.1)`,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                      }}
                    >
                      {/* User info section */}
                      <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(26,83,92,0.06)' }}>
                        <div className="font-semibold text-sm">{userName}</div>
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${isPro ? 'text-[#F7B801] font-semibold' : 'text-gray-500'}`}>
                            {isPro ? "Pro member" : "Free member"}
                          </div>
                          {!isPro && (
                            <Button
                              size="sm"
                              onClick={handleUpgrade}
                              className="h-6 px-2 text-xs font-semibold"
                              style={{
                                background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`,
                                color: theme.textDark,
                              }}
                            >
                              Upgrade
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Upgrade CTA for free users inside dropdown */}
                      {!isPro && (
                        <div className="px-3 py-2 mb-1" style={{ background: 'rgba(247, 184, 1, 0.1)' }}>
                          <div className="text-xs font-semibold text-gray-800 mb-1">
                            Unlock Pro Features
                          </div>
                          <Button
                            size="sm"
                            onClick={handleUpgrade}
                            className="w-full h-8 text-xs font-semibold mb-1"
                            style={{
                              background: theme.secondary,
                              color: theme.textDark,
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mr-1">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                fill="currentColor" />
                            </svg>
                            Upgrade Now
                          </Button>
                          <div className="text-[10px] text-gray-600">
                            Unlimited paths, AI features, and more
                          </div>
                        </div>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => navigate("/profile")}
                        className="cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/settings")}
                        className="cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                      >
                        Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="my-1" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
                      
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}

            {/* Mobile hamburger (right) */}
            <Button
              variant="ghost"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 hover:bg-white/5"
              data-drawer-button
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M4 7h16M4 12h16M4 17h16" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          drawerOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            drawerOpen ? "opacity-40" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
          className={`absolute top-0 right-0 h-full w-full sm:max-w-sm transform transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ 
            willChange: "transform",
            boxShadow: "-4px 0 40px rgba(0,0,0,0.15)"
          }}
        >
          <div className="h-full bg-white flex flex-col overflow-hidden">
            {/* Drawer header */}
            <div 
              className="px-5 py-4 border-b" 
              style={{ 
                borderColor: "rgba(26,83,92,0.08)",
                background: theme.lightBg
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white relative">
                    {!isPro && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                            fill="white" />
                        </svg>
                      </div>
                    )}
                    <AvatarFallback 
                      className="text-white font-bold"
                      style={{ 
                        background: theme.primary,
                        borderRadius: 10
                      }}
                    >
                      {initials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-gray-900">{userName}</div>
                    <div className={`text-sm ${isPro ? 'text-[#F7B801] font-semibold' : 'text-gray-600'}`}>
                      {isPro ? "Pro member" : "Free member"}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Upgrade banner for free users (mobile drawer) */}
            {isLoggedIn && !isPro && (
              <div 
                className="px-5 py-3 border-b" 
                style={{ 
                  background: `linear-gradient(135deg, rgba(247, 184, 1, 0.1), rgba(255, 107, 107, 0.1))`,
                  borderColor: "rgba(247, 184, 1, 0.2)"
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Upgrade to Pro</div>
                    <div className="text-xs text-gray-600 mt-0.5">Unlock unlimited features</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleUpgrade}
                    className="text-xs font-semibold px-3 py-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`,
                      color: theme.textDark,
                    }}
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            )}

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  if (link.requiresAuth && !isLoggedIn) return null;
                  const isActive = location.pathname === link.path;
                  return (
                    <Button
                      key={link.path}
                      variant="ghost"
                      onClick={() => navTo(link.path)}
                      className={`w-full justify-start text-left px-4 py-3 rounded-lg text-base ${
                        isActive 
                          ? "bg-gray-50 text-[#1A535C] font-semibold" 
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Button>
                  );
                })}

                {!isLoggedIn ? (
                  <>
                    <Button
                      onClick={() => navTo("/signup")}
                      className="w-full justify-center mt-4 py-3 rounded-lg text-base font-semibold"
                      style={{
                        background: theme.primary,
                        color: theme.textLight,
                      }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navTo("/signin")}
                      className="w-full justify-center mt-2 py-3 rounded-lg text-base font-semibold border-gray-300 hover:bg-gray-50"
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <div className="mt-6">
                    {/* Upgrade option for free users in drawer menu */}
                    {!isPro && (
                      <div className="mb-4">
                        <Button
                          onClick={handleUpgrade}
                          className="w-full py-3 rounded-lg text-base font-semibold mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`,
                            color: theme.textDark,
                            boxShadow: "0 4px 15px rgba(247, 184, 1, 0.3)",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                              fill="currentColor" />
                          </svg>
                          Upgrade to Pro
                        </Button>
                        <div className="text-xs text-gray-500 text-center px-2">
                          Get unlimited paths, AI features, and priority support
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t" style={{ borderColor: "rgba(26,83,92,0.08)" }}>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          onClick={() => navTo("/profile")}
                          className="w-full justify-start text-left px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-gray-50"
                        >
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => navTo("/settings")}
                          className="w-full justify-start text-left px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-gray-50"
                        >
                          Settings
                        </Button>
                        
                        {/* Plan management option */}
                        <Button
                          variant="ghost"
                          onClick={() => navTo(isPro ? "/billing" : "/upgrade")}
                          className="w-full justify-start text-left px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-gray-50"
                        >
                          {isPro ? "Manage Plan" : "View Plans"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-left px-4 py-3 rounded-lg text-base text-red-600 hover:bg-red-50 mt-2"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer footer */}
            <div 
              className="p-5 border-t" 
              style={{ 
                borderColor: "rgba(26,83,92,0.08)",
                background: theme.lightBg
              }}
            >
              <div className="text-xs text-gray-500 text-center">
                Polaris Learning Paths • Version 1.0
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}