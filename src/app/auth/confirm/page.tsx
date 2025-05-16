"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Confirming your email...")

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const tokenHash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!tokenHash || !type) {
          setStatus("error")
          setMessage("Invalid confirmation link")
          return
        }

        // Here you would integrate with Supabase to confirm the email
        // const { error } = await supabase.auth.verifyOtp({
        //   token_hash: tokenHash,
        //   type: type as any,
        // })

        // if (error) {
        //   setStatus("error")
        //   setMessage(error.message)
        //   return
        // }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setStatus("success")
        setMessage("Email confirmed successfully! Redirecting to login...")

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred while confirming your email")
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-6 bg-black/40 backdrop-blur-xl rounded-lg border border-white/10 text-white"
      >
        <div className="text-center">
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-12 w-12 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-12 w-12 rounded-full bg-red-500 mx-auto mb-4 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}

          <h2 className="text-xl font-bold mb-2">Email Confirmation</h2>
          <p className="text-white/70 mb-6">{message}</p>

          {status === "error" && <Button onClick={() => router.push("/")}>Return to Login</Button>}
        </div>
      </motion.div>
    </div>
  )
}
