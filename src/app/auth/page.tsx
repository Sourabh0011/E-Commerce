"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Mail, Lock, User, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    try {
      const endpoint = isSignUp ? "signup" : "login";
      const body = isSignUp 
        ? { username: username.trim(), email: email.trim(), password: password.trim() }
        : { email: email.trim(), password: password.trim() };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      login(data);
      toast({ title: "Success", description: isSignUp ? "Account created!" : "Signed in!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Fallback for demo if backend endpoint doesn't exist yet
        if (res.status === 404) {
          toast({ 
            title: "Coming Soon", 
            description: "Password reset feature is being implemented. Please contact support.",
          });
          return;
        }
        throw new Error(data.message || "Failed to send reset email");
      }

      toast({ 
        title: "Email Sent", 
        description: "Check your inbox for password reset instructions." 
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    if (isForgotPassword) {
      setIsForgotPassword(false);
    } else {
      setIsSignUp(!isSignUp);
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4"
            >
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isForgotPassword ? "Reset Password" : (isSignUp ? "Create Account" : "Welcome Back")}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {isForgotPassword 
                ? "Enter your email to receive a reset link" 
                : (isSignUp ? "Join our community of book lovers" : "Sign in to continue your journey")}
            </p>
          </div>

          <form onSubmit={isForgotPassword ? handleForgotPassword : handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignUp && !isForgotPassword && (
                <motion.div
                  key="username-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={isSignUp}
                      className="rounded-xl pl-10 h-12 bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl pl-10 h-12 bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isForgotPassword && (
                <motion.div
                  key="password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                    {!isSignUp && (
                      <button 
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!isForgotPassword}
                      className="rounded-xl pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full rounded-xl h-12 text-base font-bold transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            >
              {loading ? "Processing..." : (isForgotPassword ? "Send Reset Link" : (isSignUp ? "Sign Up" : "Sign In"))}
            </Button>
          </form>

          <div className="mt-8 text-center">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center mx-auto gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-bold hover:underline underline-offset-4 flex items-center justify-center mx-auto gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
