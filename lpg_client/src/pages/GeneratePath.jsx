import React, { useState } from "react";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { generateLearningPath } from "@/utils/paths_ctb";
import { addPath, setSelectedPathId } from "@/store/pathSlice";
import { toastError, toastInfo, toastSuccess } from "@/lib/sonner";

/* zod schema */
const schema = z.object({
  goal: z
    .string()
    .min(10, { message: "Please describe your goal (at least 10 characters)." }),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1, { message: "Duration is required (e.g. 6 weeks)." }),
  dailyCommitment: z
    .string()
    .min(1, { message: "Daily commitment is required (e.g. 1.5 hours)." }),
});

export default function GeneratePath() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      goal: "",
      skillLevel: "Beginner",
      duration: "",
      dailyCommitment: "",
    },
  });

  const dispatch = useDispatch();

  async function onSubmit(values) {
    setLoading(true);
    console.log("Generate Path:", values);
    try {
      const res = await generateLearningPath({...values});
      const learningPath = res.learningPath;
      const message = res.message;
      if(learningPath){
        // Store learning path in Redux
        dispatch(addPath({path:learningPath}));
        dispatch(setSelectedPathId({pathId:learningPath._id}));
        // Navigate to path details page
        navigate(`/paths/${learningPath._id}`); 
        toastSuccess('Learning path generated successfully!');
      }
      else toastInfo(message || 'Failed to generate learning path');
    } catch (error) {
      toastError(error.message || 'An error occurred while generating the learning path');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9F9] px-4 py-12">
      <Card className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-md">
        <div className="mb-4 text-center">
          <h1
            className="text-2xl font-extrabold"
            style={{ color: "#1A535C", fontFamily: "Montserrat, sans-serif" }}
          >
            Generate a Learning Path
          </h1>
          <p className="text-sm text-[#636E72] mt-1">
            Tell Polaris what you want to learn and how much time you can commit.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Goal */}
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning goal</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="E.g. Master DSA for coding interviews"
                      className="min-h-[120px] bg-[#F7F9F9] border border-[#E6EEF0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skill Level */}
            <FormField
              control={form.control}
              name="skillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration + Daily Commitment */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total duration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. 6 weeks"
                        className="bg-[#F7F9F9] border border-[#E6EEF0]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyCommitment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily commitment</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. 1.5 hours"
                        className="bg-[#F7F9F9] border border-[#E6EEF0]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              style={{ background: "#F7B801", color: "#111" }}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Path"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
