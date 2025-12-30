// src/pages/SignIn.jsx
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

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
import { useDispatch } from "react-redux";
import { signInUser } from "@/utils/auth_ctb";
import { toastError, toastSuccess } from "@/lib/sonner";
import { signInSuccess } from "@/store/authSlice";


/* validation schema */
const signInSchema = z.object({
  email: z.string().min(2, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function SignIn() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values) {
    setLoading(true);
    console.log("SignIn form values:", values);
    try {
      const res = await signInUser({...values});
      const user = res?.user;
      const message = res?.message;
      console.log(message);
      if(user){
        dispatch(signInSuccess({ user }));
        navigate("/");
      }
      toastSuccess(message || "Signed in successfully!");
    } catch (error) {
      toastError(error.message || "Error signing in" );
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F7F9F9] text-[#2D3436]">
      <div
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-transparent"
        style={{ boxShadow: "0 8px 28px rgba(26,83,92,0.06)" }}
      >
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 justify-center mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "#1A535C" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#F7F9F9" />
                <circle cx="12" cy="12" r="1.8" fill="#F7B801" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#1A535C" }}>
                Polaris
              </div>
              <div className="text-xs text-[#636E72]">Welcome back — sign in to continue</div>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold">Sign In</h2>
          <p className="text-sm text-[#636E72] mt-2">Access your learning paths and continue where you left off</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input type="password" placeholder="Your password" {...field} className="bg-[#F7F9F9] border border-[#E6EEF0]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-[#636E72]">
                <a href="#" className="font-medium text-[#1A535C] hover:underline">Forgot password?</a>
              </div>
              <div />
            </div>

            <Button type="submit" className="cursor-pointer w-full bg-[#F7B801] text-[#111] hover:bg-[#D49D00]">
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-[#636E72]">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-[#1A535C] hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
