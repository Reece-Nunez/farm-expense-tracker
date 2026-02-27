import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function FloatingDonationButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 lg:z-50"
    >
      <a
        href="https://buy.stripe.com/9B67sLbEnbfA57MgvAfrW00"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-full shadow-lg transition-all duration-200 lg:px-4 lg:py-3 lg:text-sm"
      >
        <FaHeart className="text-white w-3 h-3 lg:w-4 lg:h-4" />
        <span className="hidden sm:inline">Donate</span>
        <FaHeart className="sm:hidden text-white w-3 h-3" />
      </a>
    </motion.div>
  );
}
