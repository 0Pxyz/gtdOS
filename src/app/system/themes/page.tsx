"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"

const availableThemes = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "A futuristic cyberpunk theme with pixel art and neon blue accents",
    preview: "/images/cyberpunk-bg.png",
  },
  {
    id: "space",
    name: "Space",
    description: "A space-themed login screen with planets and satellites",
    preview: "/images/space-bg.png",
  },
]

export default function ThemesPage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState("cyberpunk")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="p-4 border-b border-white/10 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/system")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">SDDM Themes</h1>
      </header>

      <main className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {availableThemes.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden rounded-lg border cursor-pointer
                ${selectedTheme === theme.id ? "border-primary" : "border-white/10"}
              `}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${theme.preview})` }} />
              <div className="p-4 bg-black/50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{theme.name}</h3>
                  {selectedTheme === theme.id && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-white/70 mt-1">{theme.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => {
              // Here you would save the theme selection
              router.push("/system")
            }}
          >
            Apply Theme
          </Button>
        </div>
      </main>
    </div>
  )
}
