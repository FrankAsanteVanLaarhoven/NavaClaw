"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MousePointer2 } from "lucide-react"

interface CollaborationUser {
  id: string
  name: string
  avatar: string
  color: string
  position: { x: number; y: number }
  isActive: boolean
}

interface CollaborationItem {
  id: string
  title: string
  users: CollaborationUser[]
}

const CollaborationInterface = () => {
  const [items] = useState<CollaborationItem[]>([
    {
      id: "1",
      title: "First item",
      users: [
        {
          id: "user-1",
          name: "Alex",
          avatar: "A",
          color: "bg-red-500",
          position: { x: 0, y: 0 },
          isActive: true,
        },
      ],
    },
    {
      id: "2",
      title: "Second item",
      users: [
        {
          id: "user-2",
          name: "Blake",
          avatar: "B",
          color: "bg-blue-500",
          position: { x: 0, y: 0 },
          isActive: true,
        },
      ],
    },
    {
      id: "3",
      title: "Third item",
      users: [
        {
          id: "user-3",
          name: "Charlie",
          avatar: "C",
          color: "bg-green-500",
          position: { x: 0, y: 0 },
          isActive: true,
        },
      ],
    },
  ])

  const [cursorPosition, setCursorPosition] = useState({ x: 120, y: 80 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 20,
        y: prev.y + (Math.random() - 0.5) * 10,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1d21] p-8 relative overflow-hidden">
      {/* Background Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-6xl md:text-8xl font-bold text-white/5 select-none">
          Collaboration
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#2a2f36] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
            >
              {/* Item Content */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                  {item.title}
                </h3>
                
                {/* User Avatars */}
                <div className="flex items-center space-x-3">
                  {item.users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      {/* Presence Ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-full ${user.color} opacity-20`}
                        animate={{
                          scale: user.isActive ? [1, 1.2, 1] : 1,
                          opacity: user.isActive ? [0.2, 0.4, 0.2] : 0.2,
                        }}
                        transition={{
                          duration: 2,
                          repeat: user.isActive ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                      />
                      
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-white font-medium text-sm border-2 border-white/20 relative z-10`}
                      >
                        {user.avatar}
                      </div>
                      
                      {/* Active Indicator */}
                      <AnimatePresence>
                        {user.isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1d21] z-20"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cursor Indicator (only on first item) */}
              {index === 0 && (
                <motion.div
                  className="absolute text-white"
                  animate={{
                    x: cursorPosition.x,
                    y: cursorPosition.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  style={{
                    left: -100,
                    top: -60,
                  }}
                >
                  <MousePointer2 className="w-5 h-5" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Real-time Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm">3 users actively collaborating</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CollaborationInterface