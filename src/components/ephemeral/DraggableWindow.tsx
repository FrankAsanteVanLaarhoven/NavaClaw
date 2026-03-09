import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DraggableWindowProps {
  children: ReactNode;
  id: string;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({ children, id }) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 w-full group"
      style={{ touchAction: 'none' }}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-700/30 rounded-full cursor-grab active:cursor-grabbing hover:bg-emerald-500/50 transition-colors z-50 opacity-0 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
};
