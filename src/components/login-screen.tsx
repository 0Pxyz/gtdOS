"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Lock,
  Power,
  RefreshCw,
  Moon,
  ChevronLeft,
  ChevronRight,
  Mail,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { createClient } from "@/utils/supabase/client"

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>
type ResetFormValues = z.infer<typeof resetSchema>

// Theme definitions
const themes = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    backgroundImage: "/images/cyberpunk-bg.png",
    fontClass: "font-mono",
    timeClass: "text-[#a3e4ff] text-6xl font-pixel",
    dateClass: "text-[#a3e4ff] opacity-80",
    formClass: "bg-[#0a1525]/40 backdrop-blur-xl border border-[#3a6a9c]/30 rounded-lg p-6",
    inputClass: "bg-[#1a2e4c]/50 border-[#3a6a9c]/30 text-[#a3e4ff]",
    buttonClass: "bg-[#a3e4ff] text-[#1a2e4c] hover:bg-[#7bc9ff]",
    systemButtonClass: "text-[#a3e4ff] hover:bg-[#1a2e4c]/50",
    tabClass: "data-[state=active]:bg-[#1a2e4c]/70 data-[state=active]:text-[#a3e4ff]",
    alertClass: "bg-[#1a2e4c]/70 border-[#3a6a9c]/50",
    linkClass: "text-[#a3e4ff] hover:text-[#7bc9ff] underline-offset-4 hover:underline",
  },
  {
    id: "space",
    name: "Space",
    backgroundImage: "/images/space-bg.png",
    fontClass: "font-sans",
    timeClass: "text-white text-6xl font-light",
    dateClass: "text-white/80",
    formClass: "bg-[#1a2e4c]/30 backdrop-blur-xl rounded-xl border border-white/10 p-6",
    inputClass: "bg-white/10 border-white/20 text-white",
    buttonClass: "bg-white/20 text-white hover:bg-white/30",
    systemButtonClass: "text-white/80 hover:bg-white/10",
    tabClass: "data-[state=active]:bg-white/20 data-[state=active]:text-white",
    alertClass: "bg-white/10 border-white/20",
    linkClass: "text-white/80 hover:text-white underline-offset-4 hover:underline",
  },
]

type AuthMode = "login" | "signup" | "reset" | "resetSent" | "verifying"

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [error, setError] = useState<string | null>(null)
  const [resetEmail, setResetEmail] = useState("")
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const currentTheme = themes[currentThemeIndex]

  // Check for verification token in URL
  useEffect(() => {
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type")

    if (token_hash && type) {
      setAuthMode("verifying")

      const verifyOtp = async () => {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })

          if (error) {
            throw error
          }

          // Redirect to system after successful verification
          router.push("/system")
        } catch (error: any) {
          setError(error.message || "Verification failed")
          setAuthMode("login")
        }
      }

      verifyOtp()
    }
  }, [searchParams, router, supabase.auth])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onLogin(values: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      // Redirect to /system after successful login
      router.push("/system")
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSignup(values: SignupFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Show success message
      alert("Check your email for the confirmation link")

      // Reset form
      signupForm.reset()

      // Switch to login mode
      setAuthMode("login")
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  async function onReset(values: ResetFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setResetEmail(values.email)
      setAuthMode("resetSent")
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  const nextTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % themes.length)
  }

  const prevTheme = () => {
    setCurrentThemeIndex((prev) => (prev - 1 + themes.length) % themes.length)
  }

  // System button functions
  const handleShutdown = () => {
    router.push("/landing")
  }

  const handleRestart = () => {
    window.location.reload()
  }

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: `url(${currentTheme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Theme selector buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          className="bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-black/40 rounded-md p-2"
          onClick={prevTheme}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-black/40 rounded-md p-2"
          onClick={nextTheme}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col items-center max-w-md w-full px-4 ${currentTheme.fontClass}`}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-2"
            >
              <time className={currentTheme.timeClass}>
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </time>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={currentTheme.dateClass}
            >
              {currentTime.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
            </motion.p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              {authMode === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={currentTheme.formClass}
                >
                  <h2 className="text-xl font-semibold mb-4 text-center text-white">Login</h2>

                  {error && (
                    <div
                      className={`mb-4 p-3 rounded-md ${currentTheme.alertClass} text-red-400 flex gap-2 items-start`}
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                        <input
                          {...loginForm.register("email")}
                          placeholder="Email"
                          className={`w-full pl-10 p-2 rounded-md ${currentTheme.inputClass}`}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                        <input
                          {...loginForm.register("password")}
                          type="password"
                          placeholder="Password"
                          className={`w-full pl-10 p-2 rounded-md ${currentTheme.inputClass}`}
                        />
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <button type="button" onClick={() => setAuthMode("signup")} className={currentTheme.linkClass}>
                        Create account
                      </button>
                      <button type="button" onClick={() => setAuthMode("reset")} className={currentTheme.linkClass}>
                        Forgot password?
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full p-2 rounded-md flex justify-center items-center ${currentTheme.buttonClass}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {authMode === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={currentTheme.formClass}
                >
                  <div className="flex items-center mb-4">
                    <button
                      className={`p-1 rounded-md ${currentTheme.systemButtonClass}`}
                      onClick={() => setAuthMode("login")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-semibold text-center flex-1 text-white">Create Account</h2>
                  </div>

                  {error && (
                    <div
                      className={`mb-4 p-3 rounded-md ${currentTheme.alertClass} text-red-400 flex gap-2 items-start`}
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                        <input
                          {...signupForm.register("email")}
                          placeholder="Email"
                          className={`w-full pl-10 p-2 rounded-md ${currentTheme.inputClass}`}
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <p className="text-red-400 text-xs mt-1">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                        <input
                          {...signupForm.register("password")}
                          type="password"
                          placeholder="Password"
                          className={`w-full pl-10 p-2 rounded-md ${currentTheme.inputClass}`}
                        />
                      </div>
                      {signupForm.formState.errors.password && (
                        <p className="text-red-400 text-xs mt-1">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                        <input
                          {...signupForm.register("confirmPassword")}
                          type="password"
                          placeholder="Confirm Password"
                          className={`w-full pl-10 p-2 rounded-md ${currentTheme.inputClass}`}
                        />
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-red-400 text-xs mt-1">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full p-2 rounded-md flex justify-center items-center ${currentTheme.buttonClass}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {authMode === "reset" && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={currentTheme.formClass}
                >
                  <div className="flex items-center mb-4">
                    <button
                      className={`p-1 rounded-md ${currentTheme.systemButtonClass}`}
                      onClick={() => setAuthMode("login")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-semibold text-center flex-1 text-white">Reset Password</h2>
                  </div>

                  {error && (
                    <div
                      className={`mb-4 p-3 rounded-md ${currentTheme.alertClass} text-red-400 flex gap-2 items-start`}
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <p className="text-white/70 mb-4 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                        <input
                          {...resetForm.register("email")}
                          placeholder="Email"
                          className={`w-full pl-10 p-2 rounded-md ${currentTheme.inputClass}`}
                        />
                      </div>
                      {resetForm.formState.errors.email && (
                        <p className="text-red-400 text-xs mt-1">{resetForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full p-2 rounded-md flex justify-center items-center ${currentTheme.buttonClass}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {authMode === "resetSent" && (
                <motion.div
                  key="resetSent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={currentTheme.formClass}
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-white">Check Your Email</h2>
                    <p className="text-white/70 mb-6 text-sm">
                      We've sent a password reset link to <span className="text-white">{resetEmail}</span>. Please check
                      your inbox and follow the instructions.
                    </p>
                    <button
                      className={`px-4 py-2 rounded-md ${currentTheme.buttonClass}`}
                      onClick={() => setAuthMode("login")}
                    >
                      Back to Login
                    </button>
                  </div>
                </motion.div>
              )}

              {authMode === "verifying" && (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={currentTheme.formClass}
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-white">Verifying Your Email</h2>
                    <p className="text-white/70 mb-6">Please wait while we verify your email address...</p>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* System buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex justify-center gap-6"
          >
            <button className={`p-2 rounded-md ${currentTheme.systemButtonClass}`} onClick={handleShutdown}>
              <Power className="h-5 w-5" />
              <span className="sr-only">Go to Landing Page</span>
            </button>
            <button className={`p-2 rounded-md ${currentTheme.systemButtonClass}`} onClick={handleRestart}>
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">Refresh Page</span>
            </button>
            <button className={`p-2 rounded-md ${currentTheme.systemButtonClass}`} onClick={handleToggleTheme}>
              <Moon className="h-5 w-5" />
              <span className="sr-only">Toggle Theme</span>
            </button>
          </motion.div>

          {/* Session info */}
          <div className="mt-6 text-xs text-white/50 text-center">
            <p>Session (i3)</p>
            <p>Virtual Keyboard (off)</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
