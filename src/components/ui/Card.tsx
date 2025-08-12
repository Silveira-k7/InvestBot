import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' } : {}}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  );
};