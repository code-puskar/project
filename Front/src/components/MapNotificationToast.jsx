import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DISPLAY_MS = 4500;
const EXIT_MS = 0.28;

export function useMapNotifications() {
  const queueRef = useRef([]);
  const [active, setActive] = useState(null);

  const showNextFromQueue = useCallback(() => {
    const next = queueRef.current.shift();
    if (next) setActive(next);
  }, []);

  const addNotification = useCallback(
    (message) => {
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        message,
      };
      setActive((current) => {
        if (!current) return item;
        queueRef.current.push(item);
        return current;
      });
    },
    []
  );

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setActive(null), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [active]);

  const handleExitComplete = useCallback(() => {
    showNextFromQueue();
  }, [showNextFromQueue]);

  return { active, addNotification, handleExitComplete };
}

export default function MapNotificationToast({ active, onExitComplete }) {
  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-[4.5rem] z-[60] w-[min(calc(100%-1.25rem),22rem)] -translate-x-1/2 md:top-20 md:w-[min(calc(100%-2rem),24rem)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        {active && (
          <motion.div
            key={active.id}
            role="status"
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -48 }}
            transition={{ duration: EXIT_MS, ease: "easeInOut" }}
            className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-[#FFE499] bg-[#FFF9E6]/95 px-3.5 py-2.5 text-[#805B00] shadow-lg shadow-yellow-500/10 backdrop-blur-md"
          >
            <motion.div
              className="mt-0.5 shrink-0 rounded-lg bg-[#FFEDAE] p-1.5 text-[#996D00]"
              aria-hidden
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
            <p className="min-w-0 flex-1 text-sm font-medium leading-snug line-clamp-3">
              {active.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
