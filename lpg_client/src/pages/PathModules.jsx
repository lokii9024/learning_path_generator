// src/pages/PathModules.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


/* Mock modules data (covers all cases) */
const INITIAL_MODULES = [
  {
    id: "m_01",
    title: "Intro & Environment Setup",
    content:
      `This module walks you through installing Node, Git, and Visual Studio Code. 
      
You'll learn:
- Installing Node and npm
- Setting up VSCode and extensions (Prettier, ESLint)
- Creating a starter project and running a dev server
- Basic terminal commands and Git workflows

Examples and commands included. Follow along to ensure your environment matches course requirements.`,
    duration: "2 days",
    videos: [
      {
        title: "VSCode Setup for Productivity",
        channel: "DevTools",
        thumbnail: "https://via.placeholder.com/320x180?text=VSCode",
        url: "https://youtube.com/watch?v=abc1",
        publishedAt: "2024-05-01",
      },
      {
        title: "NodeJS Quickstart",
        channel: "NodeBytes",
        thumbnail: "https://via.placeholder.com/320x180?text=NodeJS",
        url: "https://youtube.com/watch?v=abc2",
        publishedAt: "2023-11-16",
      },
    ],
    repos: [
      {
        name: "starter-frontend",
        description: "Minimal starter app for frontend experiments",
        url: "https://github.com/example/starter-frontend",
        stars: 120,
        language: "JavaScript",
        owner: "example",
      },
    ],
    isCompleted: false,
  },

  {
    id: "m_02",
    title: "HTML & CSS Basics",
    content:
      `Semantic HTML, box model, and responsive layouts using Flexbox.
      
Topics:
1. HTML semantics and accessibility basics
2. CSS box model, display & position
3. Flexbox layouts and simple responsive patterns
4. Small exercises building a header and responsive card`,
    duration: "1 week",
    videos: [],
    repos: [
      {
        name: "css-snippets",
        description: "Useful CSS patterns and utilities",
        url: "https://github.com/example/css-snippets",
        stars: 45,
        language: "CSS",
        owner: "example",
      },
    ],
    isCompleted: false,
  },

  {
    id: "m_03",
    title: "JavaScript Fundamentals",
    content:
      `Core JavaScript fundamentals: scope, closures, arrays, and objects.
      
Deep dives:
- Function scope vs block scope
- Closures and practical use-cases
- Array methods (map, filter, reduce)
- Asynchronous patterns: callbacks, promises, async/await`,
    duration: "2 weeks",
    videos: [],
    repos: [],
    isCompleted: false,
  },

  {
    id: "m_04",
    title: "React Basics",
    content:
      `React fundamentals including components, props, and basic hooks.

You'll build:
- A small to-do application using useState
- A data-fetching example using useEffect
- Component composition and prop drilling`,
    duration: "3 weeks",
    videos: [
      {
        title: "React in 100 Seconds",
        channel: "Fireship",
        thumbnail: "https://via.placeholder.com/320x180?text=React",
        url: "https://youtube.com/watch?v=abc3",
        publishedAt: "2022-03-10",
      },
    ],
    repos: [],
    isCompleted: true,
  },
];

export default function PathModules() {
  const navigate = useNavigate?.() || (() => {});
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [openId, setOpenId] = useState(null);
  const [fetching, setFetching] = useState({}); // track fetching state per module

  // Fetch mock videos
  function fetchVideos(moduleId) {
    setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), videos: true } }));
    setTimeout(() => {
      const sampleVideos = [
        {
          title: "Advanced JS Patterns",
          channel: "JS Mastery",
          thumbnail: "https://via.placeholder.com/320x180?text=JS+Patterns",
          url: "https://youtube.com/watch?v=vid_sample1",
          publishedAt: "2024-01-20",
        },
        {
          title: "Performance Tips",
          channel: "PerfLab",
          thumbnail: "https://via.placeholder.com/320x180?text=Performance",
          url: "https://youtube.com/watch?v=vid_sample2",
          publishedAt: "2023-09-10",
        },
      ];

      setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, videos: sampleVideos } : m)));
      setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), videos: false } }));
      toastr.success("Videos fetched (mock)", "Success");
    }, 900);
  }

  // Fetch mock repos
  function fetchRepos(moduleId) {
    setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), repos: true } }));
    setTimeout(() => {
      const sampleRepos = [
        {
          name: "awesome-project",
          description: "A hands-on project to practice the module concepts",
          url: "https://github.com/example/awesome-project",
          stars: 250,
          language: "TypeScript",
          owner: "example",
        },
        {
          name: "exercises",
          description: "Small exercises and solutions",
          url: "https://github.com/example/exercises",
          stars: 78,
          language: "JavaScript",
          owner: "example",
        },
      ];

      setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, repos: sampleRepos } : m)));
      setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), repos: false } }));
    //   toastr.success("Repos fetched (mock)", "Success");
    }, 900);
  }

  function toggleComplete(moduleId) {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, isCompleted: !m.isCompleted } : m)));
    // toastr.info("Module updated", "Updated");
  }

  function toggleOpen(moduleId) {
    setOpenId((cur) => (cur === moduleId ? null : moduleId));
  }

  return (
    <div className="min-h-screen bg-[#F7F9F9] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-[#1A535C] font-medium"
            >
              ← Back
            </button>

            <h1
              className="mt-3 text-2xl md:text-3xl font-extrabold"
              style={{ color: "#1A535C", fontFamily: "Montserrat, sans-serif" }}
            >
              Modules — Frontend Fundamentals
            </h1>
            <p className="mt-1 text-sm text-[#636E72]">
              All modules for this learning path. Expand a module to see videos, repos and the full content.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Button className="bg-[#F7B801] text-[#111]">Add Module</Button>
            <Button variant="outline" className="border border-[#DEEAF0] text-[#1A535C] bg-white">Export</Button>
          </div>
        </header>

        <div className="space-y-4">
          {modules.map((mod) => {
            const isOpen = openId === mod.id;

            return (
              <Card key={mod.id} className="rounded-2xl" style={{ boxShadow: "0 8px 28px rgba(26,83,92,0.06)" }}>
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Left: avatar + title */}
                    <div className="flex items-start md:items-center gap-4 w-full md:w-2/3">
                      <div className="flex-shrink-0">
                        <Avatar className="w-12 h-12 md:w-14 md:h-14">
                          <AvatarFallback className="bg-[#1A535C] text-white w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
                            {mod.title.split(" ").slice(0,2).map(s => s[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base md:text-lg font-semibold text-[#2D3436] truncate">{mod.title}</h3>
                          <Badge variant="outline" className="border-[#E6EEF0] text-[#1A535C]">{mod.duration}</Badge>
                          {mod.isCompleted && <Badge className="bg-[#E6F2EF] text-[#0f766e]">Completed</Badge>}
                        </div>
                        {/* note: content moved to details area below */}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="w-full md:w-1/3 flex items-center justify-end gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          className="flex-1 sm:flex-none bg-[#F7B801] text-[#111]"
                          onClick={() => toggleComplete(mod.id)}
                        >
                          {mod.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                        </Button>

                        <div className="shrink-0">
                          <Button variant="ghost" className="p-2">⋯</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-[#636E72]">
                      {mod.videos.length} videos • {mod.repos.length} repos
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="text-sm" onClick={() => toggleOpen(mod.id)}>
                        {isOpen ? "Hide details" : "Show details"}
                      </Button>
                    </div>
                  </div>

                  {/* Details (shown only when expanded) */}
                  {isOpen && (
                    <div className="mt-4 space-y-5">
                      {/* Large content block (scrollable if long) */}
                      <div
                        className="text-sm md:text-[15px] leading-relaxed text-[#2D3436] bg-white border border-[#E6EEF0] rounded-xl p-4 sm:p-5 overflow-y-auto"
                        style={{ whiteSpace: "pre-line", maxHeight: "min(48vh, 520px)" }}
                      >
                        {mod.content}
                      </div>

                      {/* Videos section */}
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[#1A535C]">Videos</h4>
                          {mod.videos.length === 0 && (
                            <Button
                              size="sm"
                              className="bg-[#1A535C] text-white"
                              onClick={() => fetchVideos(mod.id)}
                              disabled={fetching[mod.id]?.videos}
                            >
                              {fetching[mod.id]?.videos ? "Fetching..." : "Fetch Videos"}
                            </Button>
                          )}
                        </div>

                        {mod.videos.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {mod.videos.map((v, idx) => (
                              <a
                                key={idx}
                                href={v.url}
                                className="flex items-start gap-3 p-3 rounded-lg border border-[#E6EEF0] bg-white hover:shadow-sm"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img src={v.thumbnail} alt={v.title} className="w-32 h-18 rounded-md object-cover flex-shrink-0" />
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-[#2D3436] truncate">{v.title}</div>
                                  <div className="mt-1 text-xs text-[#636E72]">{v.channel} • {v.publishedAt}</div>
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-[#636E72]">No videos yet.</div>
                        )}
                      </section>

                      {/* Repos section */}
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[#1A535C]">Repositories</h4>
                          {mod.repos.length === 0 && (
                            <Button
                              size="sm"
                              className="bg-[#1A535C] text-white"
                              onClick={() => fetchRepos(mod.id)}
                              disabled={fetching[mod.id]?.repos}
                            >
                              {fetching[mod.id]?.repos ? "Fetching..." : "Fetch Repos"}
                            </Button>
                          )}
                        </div>

                        {mod.repos.length > 0 ? (
                          <div className="space-y-3">
                            {mod.repos.map((r, idx) => (
                              <div key={idx} className="p-3 rounded-lg border border-[#E6EEF0] bg-white flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#2D3436] truncate block">{r.name}</a>
                                  <div className="text-xs text-[#636E72] mt-1">{r.description}</div>
                                </div>
                                <div className="text-right text-xs text-[#636E72] flex flex-col items-end">
                                  <div>{r.language}</div>
                                  <div className="font-medium text-[#2D3436]">{r.stars ? `${r.stars}★` : "-"}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-[#636E72]">No repos yet.</div>
                        )}
                      </section>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
