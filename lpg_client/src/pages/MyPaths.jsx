// src/pages/MyPaths.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/* shadcn/ui components */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* Mock data */
const MOCK_PATHS = [
  {
    id: "lp_001",
    title: "Frontend Fundamentals",
    description: "HTML, CSS, JS, React basics and component patterns.",
    modules: 8,
    completedModules: 3,
    estTime: "6 weeks",
  },
  {
    id: "lp_002",
    title: "Master DSA for Interviews",
    description:
      "Data structures, algorithms, problem solving & mock interviews.",
    modules: 12,
    completedModules: 9,
    estTime: "8 weeks",
  },
  {
    id: "lp_003",
    title: "Fullstack with Node & React",
    description: "Build fullstack apps, auth, REST, databases, deployment.",
    modules: 10,
    completedModules: 1,
    estTime: "10 weeks",
  },
  {
    id: "lp_004",
    title: "Machine Learning Crash Course",
    description: "Intro to ML concepts, models, and hands-on projects.",
    modules: 7,
    completedModules: 7,
    estTime: "5 weeks",
  },
];

function pct(path) {
  if (!path.modules) return 0;
  return Math.round((path.completedModules / path.modules) * 100);
}

export default function MyPaths() {
  const navigate = useNavigate?.() || (() => {});

  return (
    <div className="min-h-screen bg-[#F7F9F9] p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-extrabold"
              style={{ color: "#1A535C", fontFamily: "Montserrat, sans-serif" }}
            >
              Your Learning Paths
            </h1>
            <p className="mt-1 text-sm text-[#636E72] max-w-xl">
              Track progress and continue learning — one step at a time.
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Button
              asChild
              className="hidden sm:inline-flex bg-[#F7B801] text-[#111] shadow-sm"
            >
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2">
                + New path
              </a>
            </Button>
          </div>
        </header>

        <div className="space-y-4">
          {MOCK_PATHS.map((p) => {
            const percent = pct(p);

            return (
              <Card
                key={p.id}
                className="rounded-2xl"
                style={{ boxShadow: "0 8px 28px rgba(26,83,92,0.06)" }}
              >
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* LEFT: avatar + title + compact meta */}
                    <div className="flex items-start md:items-center gap-4 w-full md:w-1/2">
                      <div className="flex-shrink-0">
                        <Avatar className="w-12 h-12 md:w-14 md:h-14">
                          <AvatarFallback className="bg-[#1A535C] text-white w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
                            {p.title
                              .split(" ")
                              .slice(0, 2)
                              .map((s) => s[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-[#2D3436] truncate">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#636E72] truncate">
                          {p.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#636E72]">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#2D3436]">
                              {p.modules}
                            </span>
                            <span>modules</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#2D3436]">
                              {p.estTime}
                            </span>
                            <span>est.</span>
                          </div>

                          <div className="inline-flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-[#E6EEF0] text-[#1A535C]"
                            >
                              Polaris
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: progress + single action
                        - progress part is flexible (flex-1 min-w-0)
                        - actions are fixed (flex-none) and won't overlap
                    */}
                    <div className="w-full md:w-1/2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 w-full sm:w-2/3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-xs text-[#636E72]">
                            Completion
                          </div>
                          <div className="text-sm font-semibold text-[#2D3436]">
                            {percent}%
                          </div>
                        </div>

                        <Progress
                          value={percent}
                          className="h-2 md:h-3 rounded-full bg-[#EDF7F6]"
                        />
                      </div>

                      {/* BUTTON + DROPDOWN — side by side on ALL mobile sizes */}
                      <div className="flex w-full sm:w-auto items-center gap-2">
                        <Button
                          className="flex-1 sm:flex-none bg-[#F7B801] text-[#111]"
                          onClick={() => navigate(`/paths/${p.id}`)}
                        >
                          Make Progress
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-2 shrink-0">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle cx="12" cy="5" r="1.5" fill="#2D3436" />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="1.5"
                                  fill="#2D3436"
                                />
                                <circle
                                  cx="12"
                                  cy="19"
                                  r="1.5"
                                  fill="#2D3436"
                                />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            side="bottom"
                            align="end"
                            className="w-44"
                          >
                            <DropdownMenuItem asChild>
                              <a href="#">Edit</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href="#">Duplicate</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href="#">Delete</a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* empty state */}
        {MOCK_PATHS.length === 0 && (
          <Card
            className="mt-8 p-6 text-center"
            style={{ boxShadow: "0 8px 28px rgba(26,83,92,0.04)" }}
          >
            <CardContent>
              <h3 className="text-lg font-semibold text-[#1A535C]">
                No generated paths yet
              </h3>
              <p className="mt-2 text-sm text-[#636E72]">
                Generate your first learning path to get started.
              </p>
              <div className="mt-4">
                <Button className="bg-[#F7B801] text-[#111]">
                  Create a path
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
