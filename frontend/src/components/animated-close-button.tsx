import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ProcessedTransaction, Transaction } from "@/app/dashboard/components/types";

const AnimatedCloseButton = ({ onClick }: { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center">
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="relative w-4 h-4">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <X className="w-4 h-4" />
          </motion.div>
          <motion.div
            className="absolute top-0 left-0 w-4 h-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-4 h-4" />
          </motion.div>
        </div>
      </button>
    </div>
  );
};

export default AnimatedCloseButton;
