import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api, { setAccessToken, clearAccessToken } from "@/services/api";
import { FileText, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import type { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

const AuthLoader = ({ children }: Props) => {
  const setToken = useAuthStore((state) => state.setAccessToken);

  const { isLoading, error } = useQuery({
    queryKey: ["restore-session"],
    queryFn: async () => {
      const response = await api.get("/auth/refresh-token");

      const token = response.data.accessToken;

      setAccessToken(token);
      setToken(token);

      return token;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        clearAccessToken();
        setToken(null);
      }
    }
  }, [error, setToken]);

  if (isLoading) {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-4 overflow-hidden select-none"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
                className="relative flex size-36 items-center justify-center rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-md mb-6"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                >
                  <FileText className="size-24 text-emerald-500" />
                </motion.div>

                {/* Shimmering Pulse Effect behind the AI Sparkle */}
                <span className="absolute -top-4 -right-3.5 flex size-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/10 opacity-75"></span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="relative flex size-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                  >
                    <Sparkles className="size-6" />
                  </motion.div>
                </span>

                {/* Modern "AI Scanning" subtle laser line */}
                <motion.div
                  className="absolute inset-x-4 h-1.5 bg-neutral-600/30 rounded-full"
                  animate={{ y: [-15, 15, -15] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Typography Section */}
              <div className="text-center space-y-2 max-w-xs">
                <motion.h3
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-semibold text-neutral-900 tracking-wide text-2xl"
                >
                  Initializing CV Analyzer
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.3 }}
                  className="text-base font-medium text-neutral-500 tracking-wide"
                >
                  Securing your session...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return children;
};

export default AuthLoader;
