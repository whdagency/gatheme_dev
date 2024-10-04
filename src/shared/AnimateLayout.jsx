import React from "react";
import { motion } from "framer-motion";

const AnimatedLayout = ({ children, y = 20 }) => {
  const variants = {
    hidden: { opacity: 0, y: -y },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: y, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedLayout;
