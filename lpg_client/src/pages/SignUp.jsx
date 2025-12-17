// src/pages/SignUp.jsx
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm,useWatch } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/* simple password scoring (same as SignUp) */
function calcPasswordScore(pw = "") {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
function scoreLabel(score) {
  if (score <= 1) return "Weak";
  if (score === 2) return "Okay";
  if (score === 3) return "Strong";
  return "Very strong";
}
function scoreColor(score) {
  if (score <= 1) return "#E53E3E";
  if (score === 2) return "#F7B801";
  if (score === 3) return "#1A535C";
  return "#0f766e";
}


/* validation schema */
const formSchema = z.object({
  name: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().min(2, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function SignUp() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = useWatch({
    control: form.control,
    name: "password",
  });

  const score = useMemo(
    () => calcPasswordScore(passwordValue),
    [passwordValue]
  );

  const pct = Math.round((score / 4) * 100);

  const navigate = useNavigate();

  async function onSubmit(values) {
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F7F9F9] text-[#2D3436]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-transparent"
           style={{ boxShadow: "0 8px 28px rgba(26,83,92,0.06)" }}>
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 justify-center mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1A535C" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#F7F9F9" />
                <circle cx="12" cy="12" r="1.8" fill="#F7B801" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#1A535C" }}>Polaris</div>
              <div className="text-xs text-[#636E72]">Create your account</div>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold">Sign Up</h2>
          <p className="text-sm text-[#636E72] mt-2">Start your guided learning journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3436]">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} className="bg-[#F7F9F9] border border-[#E6EEF0]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3436]">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="bg-[#F7F9F9] border border-[#E6EEF0]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3436]">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} className="bg-[#F7F9F9] border border-[#E6EEF0]" />
                  </FormControl>
                  {<div className="mt-2">
                        <div className="w-full h-2 rounded-full bg-[#EDF7F6] overflow-hidden">
                        <div
                            style={{
                            width: `${pct}%`,
                            height: 8,
                            background: scoreColor(score),
                            transition: "width 160ms ease",
                            }}
                        />
                        </div>
                        <div className="mt-1 text-xs text-[#636E72] flex items-center justify-between">
                        <div>{scoreLabel(score)}</div>
                        </div>
                    </div>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-[#F7B801] text-[#111] hover:bg-[#D49D00]">
              Create account
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-[#636E72]">
          Already have an account?{" "}
          <a href="#" className="font-medium text-[#1A535C] hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
}
