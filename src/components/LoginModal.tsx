"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check, ArrowLeft, AlertCircle, ShieldCheck, Building2, User, Loader2, Eye, EyeOff } from "lucide-react";
import { usePetCycleStore } from "@/lib/store";
import { UserRole, AuthUser } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export type AuthView =
  | "login"
  | "signup-step1"
  | "signup-step2"
  | "signup-success"
  | "forgot-password";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup-step1";
}

export default function LoginModal({
  isOpen,
  onClose,
  initialView = "login",
}: LoginModalProps) {
  const router = useRouter();
  const { loginAs, setAuthUser } = usePetCycleStore();
  const [view, setView] = useState<AuthView>(initialView);

  // Loading and feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccessNote, setSignupSuccessNote] = useState("");

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Sign Up Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Login Form State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Sync initial view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setSignupError("");
      setLoginError("");
      setForgotError("");
      setForgotSent(false);
      setIsLoading(false);
      setSignupSuccessNote("");
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const resetAll = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgreedToTerms(false);
    setSignupError("");
    setLoginUsername("");
    setLoginPassword("");
    setLoginError("");
    setForgotEmail("");
    setForgotError("");
    setForgotSent(false);
    setIsLoading(false);
    setSignupSuccessNote("");
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);
    onClose();
  };

  // Quick Demo Login Action
  const handleQuickDemo = (role: UserRole) => {
    loginAs(role);
    resetAll();
    if (role === "superadmin") {
      router.push("/dashboard/superadmin");
    } else if (role === "shelter") {
      router.push("/dashboard/shelter");
    } else {
      router.push("/app");
    }
  };

  // Sign Up Step 1 Submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (!firstName.trim() || !lastName.trim()) {
      setSignupError("Please fill in both first and last name.");
      return;
    }
    setView("signup-step2");
  };

  // Sign Up Step 2 Submit - Creates user pre-confirmed via server API route
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setSignupError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    if (!agreedToTerms) {
      setSignupError("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        setSignupError(result.error || "Failed to create account.");
        return;
      }

      // Automatically sign in the new user immediately
      const supabase = createClient();
      const { data: signinData } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const newUser: AuthUser = {
        id: result.user?.id || signinData?.user?.id || "user-" + Date.now(),
        name: fullName || username.trim(),
        email: email.trim(),
        role: "user",
      };
      setAuthUser(newUser);

      setSignupSuccessNote("Your account has been created and verified successfully!");
      setView("signup-success");
    } catch (err: unknown) {
      setSignupError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during signup."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Login Submit - Real Supabase signInWithPassword with username resolution and auto-confirm
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const term = loginUsername.trim();
    if (!term || !loginPassword) {
      setLoginError("Please enter your email or username and password.");
      return;
    }

    // Fast-path demo shortcuts
    const lower = term.toLowerCase();
    if (lower === "superadmin") {
      handleQuickDemo("superadmin");
      return;
    }
    if (lower === "shelter") {
      handleQuickDemo("shelter");
      return;
    }
    if (lower === "user" || lower === "juan" || lower === "demo_user") {
      handleQuickDemo("user");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Resolve identifier (username or email) and ensure email is confirmed
      let targetEmail = term;
      try {
        const res = await fetch("/api/auth/resolve-identifier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: term }),
        });
        const data = await res.json();
        if (data.email) {
          targetEmail = data.email;
        }
      } catch {}

      // 2. Sign in with Supabase
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, display_name, avatar_url, shelter_id")
          .eq("id", data.user.id)
          .maybeSingle();

        const role = (profile?.role as UserRole) || "user";
        const loggedUser: AuthUser = {
          id: data.user.id,
          name:
            profile?.full_name ||
            profile?.display_name ||
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "User",
          email: data.user.email || "",
          role,
          avatar: profile?.avatar_url || data.user.user_metadata?.avatar_url,
          shelterId: profile?.shelter_id,
        };

        setAuthUser(loggedUser);
        resetAll();

        if (role === "superadmin") {
          router.push("/dashboard/superadmin");
        } else if (role === "shelter") {
          router.push("/dashboard/shelter");
        } else {
          router.push("/app");
        }
      }
    } catch (err: unknown) {
      setLoginError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Submit - Real Supabase resetPasswordForEmail
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotEmail.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        }
      );

      if (error) {
        setForgotError(error.message);
      } else {
        setForgotSent(true);
      }
    } catch (err: unknown) {
      setForgotError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In with Supabase OAuth
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const hasAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !hasAnonKey) {
        setLoginError(
          "Supabase credentials are not configured in .env.local yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)."
        );
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: location.origin + "/auth/callback",
        },
      });
      if (error) {
        setLoginError(error.message);
      }
    } catch (err: unknown) {
      setLoginError(
        err instanceof Error
          ? err.message
          : "An error occurred while connecting to Supabase."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={resetAll}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 relative border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={resetAll}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button for Step 2 */}
        {view === "signup-step2" && (
          <button
            onClick={() => setView("signup-step1")}
            className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10 flex items-center gap-1 text-xs"
            aria-label="Back to previous step"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: Create Your Account - Step 1                                    */}
        {/* ========================================================================= */}
        {view === "signup-step1" && (
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-2">
              <Image
                src="/images/petcycle-logo-512.png"
                alt="PetCycle Paw Logo"
                width={56}
                height={56}
                priority
                unoptimized
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-bold text-[#143b2f] tracking-tight text-center">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Please fill your login details
            </p>

            {signupError && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 py-1.5 px-3 rounded-lg w-full">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStep1Submit} className="w-full mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your First Name"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your Last Name"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                />
              </div>

              {/* Continue Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full font-semibold text-white bg-[#00B46B] hover:bg-[#009e5e] shadow-sm hover:shadow-md transition-all transform active:scale-[0.99] text-sm tracking-wide"
                >
                  Continue
                </button>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-5 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[#00B46B] hover:text-[#009e5e] font-semibold underline underline-offset-2 ml-0.5 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: Create Your Account - Step 2                                    */}
        {/* ========================================================================= */}
        {view === "signup-step2" && (
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-2">
              <Image
                src="/images/petcycle-logo-512.png"
                alt="PetCycle Paw Logo"
                width={56}
                height={56}
                priority
                unoptimized
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-bold text-[#143b2f] tracking-tight text-center">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Please fill your login details
            </p>

            {signupError && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 py-1.5 px-3 rounded-lg w-full">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStep2Submit} className="w-full mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email Address"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-4 pr-11 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    aria-label={showSignupPassword ? "Hide password" : "Show password"}
                  >
                    {showSignupPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showSignupConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-4 pr-11 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#00B46B] focus:ring-[#00B46B] cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight cursor-pointer">
                  I agree to the{" "}
                  <span className="text-[#00B46B] underline cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#00B46B] underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>

              {/* Done Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full font-semibold text-white bg-[#00B46B] hover:bg-[#009e5e] disabled:opacity-60 shadow-sm hover:shadow-md transition-all transform active:scale-[0.99] text-sm tracking-wide flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Done</span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-4 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[#00B46B] hover:text-[#009e5e] font-semibold underline underline-offset-2 ml-0.5 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: Success Screen                                                  */}
        {/* ========================================================================= */}
        {view === "signup-success" && (
          <div className="py-6 flex flex-col items-center text-center animate-fadeIn">
            {/* Green Success Circle with Checkmark */}
            <div className="w-20 h-20 rounded-full bg-[#00B46B] flex items-center justify-center text-white mb-4 shadow-lg shadow-[#00B46B]/25">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[#00B46B] tracking-tight">
              Success
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 px-2">
              {signupSuccessNote || "Account created successfully!"}
            </p>

            {/* Proceed Button */}
            <div className="w-full mt-8">
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  router.push("/app");
                }}
                className="w-full py-3.5 rounded-full font-semibold text-white bg-[#00B46B] hover:bg-[#009e5e] shadow-sm hover:shadow-md transition-all transform active:scale-[0.99] text-sm tracking-wide"
              >
                Proceed to PetCycle App
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: Welcome! (Login)                                                */}
        {/* ========================================================================= */}
        {view === "login" && (
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-2">
              <Image
                src="/images/petcycle-logo-512.png"
                alt="PetCycle Paw Logo"
                width={56}
                height={56}
                priority
                unoptimized
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#143b2f] tracking-tight text-center">
              Welcome!
            </h2>

            {loginError && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 py-1.5 px-3 rounded-lg w-full">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="w-full mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setView("forgot-password")}
                  className="text-xs text-[#00B46B] hover:text-[#009e5e] font-medium hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Continue Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full font-semibold text-white bg-[#00B46B] hover:bg-[#009e5e] disabled:opacity-60 shadow-sm hover:shadow-md transition-all transform active:scale-[0.99] text-sm tracking-wide flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-xs text-slate-400">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Sign In with Google */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all transform active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign In with Google</span>
              </button>

              {/* Quick Demo Role Logins */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-2 justify-center">
                  <span className="h-px bg-slate-200 flex-1"></span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    ⚡ Quick Demo Accounts
                  </span>
                  <span className="h-px bg-slate-200 flex-1"></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("superadmin")}
                    className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 transition-all flex flex-col items-center text-center cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-emerald-700 mb-0.5" />
                    <span className="text-[10px] font-bold leading-tight">Superadmin</span>
                    <span className="text-[8px] text-emerald-600">LGU Network</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("shelter")}
                    className="p-2 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-900 transition-all flex flex-col items-center text-center cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#A32801] mb-0.5" />
                    <span className="text-[10px] font-bold leading-tight">Shelter Admin</span>
                    <span className="text-[8px] text-amber-700">PAWS Center</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("user")}
                    className="p-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 transition-all flex flex-col items-center text-center cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-700 mb-0.5" />
                    <span className="text-[10px] font-bold leading-tight">Recycler</span>
                    <span className="text-[8px] text-blue-600">Mobile App</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-5 text-center text-xs text-slate-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setView("signup-step1")}
                className="text-[#00B46B] hover:text-[#009e5e] font-semibold underline underline-offset-2 ml-0.5 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: Find Your Account (Forgot Password)                             */}
        {/* ========================================================================= */}
        {view === "forgot-password" && (
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-2">
              <Image
                src="/images/petcycle-logo-512.png"
                alt="PetCycle Paw Logo"
                width={56}
                height={56}
                priority
                unoptimized
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-bold text-[#143b2f] tracking-tight text-center">
              Find Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-2 text-center max-w-xs mx-auto leading-relaxed">
              Please enter your e-mail address to below to change your user password
              and set a new password.
            </p>

            {forgotError && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 py-1.5 px-3 rounded-lg w-full">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSent ? (
              <div className="w-full my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fadeIn">
                <Check className="w-8 h-8 text-[#00B46B] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#143b2f]">
                  Reset Instructions Sent!
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-semibold text-slate-800">{forgotEmail}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="mt-4 px-6 py-2.5 rounded-full font-semibold text-white bg-[#00B46B] hover:bg-[#009e5e] text-xs transition-all"
                >
                  Back to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="w-full mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your Email Address"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B46B]/20 focus:border-[#00B46B] transition-all bg-white"
                  />
                </div>

                {/* Side-by-side Cancel and Continue Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="flex-1 py-3 px-4 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-[#00B46B] font-semibold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-full font-semibold text-white bg-[#00B46B] hover:bg-[#009e5e] disabled:opacity-60 shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Continue</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Navigation */}
            <div className="mt-5 text-center text-xs text-slate-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setView("signup-step1")}
                className="text-[#00B46B] hover:text-[#009e5e] font-semibold underline underline-offset-2 ml-0.5 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
