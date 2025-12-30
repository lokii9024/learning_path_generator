// src/pages/MyPaths.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/* shadcn/ui components */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getUserLearningPaths,deleteLearningPathById,getLearningPathById } from "@/utils/paths_ctb"; 
import { useDispatch, useSelector } from "react-redux";
import { deletePath, setAllPaths,setSelectedPathId } from "@/store/pathSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { toastError, toastInfo, toastSuccess } from "@/lib/sonner";

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
  if (!path.totalModules) return 0;
  return Math.round((path.completedModules / path.totalModules) * 100);
}

export default function MyPaths() {
  const navigate = useNavigate() 
  const dispatch = useDispatch()

  React.useEffect(() => {
    // In real implementation, fetch user's learning paths from backend
    async function fetchPaths() {
      try {
        const res = await getUserLearningPaths();
        const learningPaths = res.learningPaths;
        const message = res.message;
        if(learningPaths){
          dispatch(setAllPaths({paths:learningPaths}));
          toastSuccess(message || 'Learning paths loaded successfully');
        }else{
          toastInfo(message || 'No learning paths found');
        }
      } catch (error) {
        toastError(error.message || 'An error occurred while fetching learning paths');
      }
    }
    fetchPaths();
  }, [dispatch]);

  const paths = useSelector((state) => state.path.allPaths) || [];

  async function handleDeletePath(pathId) {
    //confirm deletion
    const con = window.confirm('Are you sure you want to delete this learning path? This action cannot be undone.');
    if(!con) return;
    try {
      const res = await deleteLearningPathById(pathId);
      if(res){
        dispatch(deletePath(pathId));
        toastSuccess('Learning path deleted successfully');
      } else {
        toastError('Failed to delete learning path');
      }
    } catch (error) {
      toastError(error.message || 'An error occurred while deleting learning path');
    }
  }

  function handleMakeProgress(pathId) {
    dispatch(setSelectedPathId(pathId));
    navigate(`/paths/${pathId}`);
  }

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
              className="cursor-pointer hidden sm:inline-flex bg-[#F7B801] text-[#111] shadow-sm"
            >
              <a onClick={() => navigate("/generate-path")} className="inline-flex items-center gap-2 px-4 py-2">
                + New path
              </a>
            </Button>
          </div>
        </header>

        <div className="space-y-4">
          {paths.map((p) => {
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
                            {p.goal
                              .split(" ")
                              .slice(0, 2)
                              .map((s) => s[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-[#2D3436] truncate">
                          {p.goal}
                        </h3>
                        <p className="mt-1 text-sm text-[#636E72] truncate">
                          Level: {p.skillLevel}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#636E72]">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#2D3436]">
                              {p.totalModules}
                            </span>
                            <span>modules</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#2D3436]">
                              {p.duration}
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
                          className="cursor-pointer flex-1 sm:flex-none bg-[#F7B801] text-[#111]"
                          onClick={() => handleMakeProgress(p._id)}
                        >
                          Make Progress
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeletePath(p._id)} // your delete handler
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                <Button 
                onClick={() => navigate("/generate-path")}
                className="cursor-pointer bg-[#F7B801] text-[#111]">
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
