"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) throw error

      setIsSuccess(true)

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "An error occurred while resetting your password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-6 bg-black/40 backdrop-blur-xl rounded-lg border border-white/10 text-white"
      >
        {!isSuccess ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Reset Your Password</h2>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 flex gap-2 items-start">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                  <input
                    {...form.register("password")}
                    type="password"
                    placeholder="New Password"
                    className="w-full pl-10 p-2 rounded-md bg-white/10 border border-white/20 text-white"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                  <input
                    {...form.register("confirmPassword")}
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full pl-10 p-2 rounded-md bg-white/10 border border-white/20 text-white"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full p-2 rounded-md bg-white/20 text-white hover:bg-white/30 flex justify-center items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-12 w-12 rounded-full bg-green-500/20 mx-auto mb-4 flex items-center justify-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Password Reset Successful</h2>
            <p className="text-white/70 mb-6">Your password has been reset successfully. Redirecting to login...</p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
