// src/pages/PathModules.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector,useDispatch } from "react-redux";
import {clearPathState, setSelectedPath,setVideosInModule,setReposInModule} from "@/store/pathSlice";
import { fetchYtVideosForModule,fetchRepositoriesForModule,markOrUnmarkModuleAsCompleted,getLearningPathById } from "@/utils/paths_ctb";
import { toastError, toastInfo, toastSuccess } from "@/lib/sonner";

export default function PathModules() {
  const {pathId} = useParams();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const [fetching, setFetching] = useState({}); // track fetching state per module
  const dispatch = useDispatch();
  
  useEffect( () => {
    async function fetchPath(){
      try {
        const res = await getLearningPathById(pathId);
        const path = res?.learningPath;
        const message = res?.message;
        if(path){
          dispatch(setSelectedPath({path}))
          toastSuccess(message);
        }else{
          toastInfo(message)
        }
      } catch (error) {
        toastError(error.message)
      }
    }
    if (pathId) {
      fetchPath();
    }
  },[pathId,dispatch] )

  const selectedPath = useSelector((state) => state.path.selectedPath);

  const modules = useSelector((state) => state.path.selectedPathModules);


  async function fetchVideos(moduleId,moduleTitle) {
    setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), videos: true } }));
    
    try {
      const res = await fetchYtVideosForModule(pathId,moduleId,moduleTitle);

      const videos = res?.videos;
      const message = res?.message;
      if(videos && videos.length > 0){
        dispatch(setVideosInModule({moduleId,videos}));
        toastSuccess("Videos fetched successfully!");
      }else{
        toastSuccess(message || "No videos found.");
      }
    } catch (error) {
      toastError(error.message || "Failed to fetch videos");
    }finally{
      setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), videos: false } }) );
    }
  }

  // Fetch mock repos
  async function fetchRepos(moduleId,moduleTitle) {
    setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), repos: true } }));
    
    try {
      const res = await fetchRepositoriesForModule(pathId,moduleId,moduleTitle);

      const repos = res?.repositories;
      const message = res?.message;
      if(repos && repos.length > 0){
        dispatch(setReposInModule({moduleId,repos}));
        toastSuccess("Repositories fetched successfully!");
      }else{
        toastInfo(message || "No repositories found.");
      }
    } catch (error) {
      toastError(error.message || "Failed to fetch repositories");
    }finally{
      setFetching((s) => ({ ...s, [moduleId]: { ...(s[moduleId] || {}), repos: false } }) );
    }
  }

  async function toggleComplete(moduleId) {
    // 1️⃣ set per-module loading
  setFetching((s) => ({
    ...s,
    [moduleId]: {
      ...(s[moduleId] || {}),
      complete: true,
    },
  }));

  try {
    // 2️⃣ await backend response
    const res = await markOrUnmarkModuleAsCompleted(
      pathId,
      moduleId
    );

    const newStatus = res?.newStatus;
    const message = res?.message;
    const success = res?.success;

    // 3️⃣ update module ONLY if backend confirms
    if (success && typeof newStatus === "boolean") {
      // update in redux
      dispatch(updateCompletionStatusInModule({ moduleId, newStatus }));
      toastSuccess(
        `Module marked as ${newStatus ? "completed" : "incomplete"}.`
      );
    } else {
      toastInfo(message || "Failed to update module status.");
    }
  } catch (error) {
    toastError(error?.message || "Failed to update module status");
  } finally {
    // 4️⃣ always reset loading
    setFetching((s) => ({
      ...s,
      [moduleId]: {
        ...(s[moduleId] || {}),
        complete: false,
      },
    }));
  }
  }

  function handleBack() {
    dispatch(clearPathState());
    navigate(-1);
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
              onClick={handleBack}
              className="cursor-pointer inline-flex items-center gap-2 text-sm text-[#1A535C] font-medium"
            >
              ← Back
            </button>

            <h1
              className="mt-3 text-2xl md:text-3xl font-extrabold"
              style={{ color: "#1A535C", fontFamily: "Montserrat, sans-serif" }}
            >
              Modules — {selectedPath?.goal || 'Learning Path'}
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
            const isOpen = openId === mod._id;

            return (
              <Card key={mod._id} className="rounded-2xl" style={{ boxShadow: "0 8px 28px rgba(26,83,92,0.06)" }}>
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
                          className="cursor-pointer flex-1 sm:flex-none bg-[#F7B801] text-[#111]"
                          onClick={() => toggleComplete(mod._id)}
                          disabled={fetching[mod._id]?.complete}
                        >
                          {fetching[mod._id]?.complete
                            ? "Updating..."
                            : mod.isCompleted
                              ? "Mark incomplete"
                              : "Mark complete"}
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
                      <Button variant="ghost" className="cursor-pointer text-sm" onClick={() => toggleOpen(mod._id)}>
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
                              className="cursor-pointer bg-[#1A535C] text-white"
                              onClick={() => fetchVideos(mod._id,mod.title)}
                              disabled={fetching[mod._id]?.videos}
                            >
                              {fetching[mod._id]?.videos ? "Fetching..." : "Fetch Videos"}
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
                              className="cursor-pointer bg-[#1A535C] text-white"
                              onClick={() => fetchRepos(mod._id,mod.title)}
                              disabled={fetching[mod._id]?.repos}
                            >
                              {fetching[mod._id]?.repos ? "Fetching..." : "Fetch Repos"}
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
