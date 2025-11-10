"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error; // Capture Supabase errors

      if (data.user) {
        console.log("Logged in:", data.user); // DEBUG: check console
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-indigo-900 to-purple-950 px-4 text-white">
      <form
        onSubmit={handleAuth}
        className="w-full max-w-md bg-indigo-950/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          {isSignUp ? "Create Account" : "Login"}
        </h1>
        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
        </Button>
        <p className="text-sm text-center mt-2">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-400 hover:underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </main>
  );
}
