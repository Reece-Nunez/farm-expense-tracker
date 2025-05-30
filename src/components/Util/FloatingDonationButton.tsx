import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function FloatingDonationButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href="https://buy.stripe.com/9B67sLbEnbfA57MgvAfrW00"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-200"
      >
        <FaHeart className="text-white" />
        Donate
      </a>
    </motion.div>
  );
}
