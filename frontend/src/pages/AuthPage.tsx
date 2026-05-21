import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background text-foreground selection:bg-emerald-100 selection:text-emerald-900 ">
      <div className="hidden lg:flex lg:mb-10 lg:col-span-5 bg-emerald-50/30 border-r border-emerald-100/60 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/5 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966905_1px,transparent_1px),linear-gradient(to_bottom,#05966905_1px,transparent_1px)] bg-size-[14px_24px]" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-neutral-900">
            CV.AI
          </span>
        </div>

        <div className="relative z-10 max-w-md space-y-6 my-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-base font-medium border border-emerald-200/50">
            <Sparkles className="size-5 text-emerald-600 animate-pulse" />{" "}
            Powered by Intelligence
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 leading-[1.2]">
            Optimize your resume for ATS tracking & impact.
          </h1>
          <ul className="space-y-3.5 text-md text-neutral-600 font-medium">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />{" "}
              Real-time keyword scoring
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />{" "}
              Smart format structural diagnostics
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-emerald-600 shrink-0" />{" "}
              Enterprise-grade data security
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-neutral-400 font-medium">
          &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>

      <div className="col-span-12 lg:col-span-7 flex items-center justify-center lg:mt-20 p-6 sm:p-12 bg-white ">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg space-y-8 border border-neutral-200/50 p-7 rounded-xl shadow-lg"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-sm text-neutral-500 font-medium">
              {tab === "login"
                ? "Enter your credentials to access your analyzed profiles"
                : "Get started completely free. No credit card required."}
            </p>
          </div>

          <div className="relative flex p-1 bg-neutral-100 rounded-xl border border-neutral-200/40">
            <Button
              variant="ghost"
              onClick={() => setTab("login")}
              className={`flex-1  py-4.5  text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 cursor-pointer ${
                tab === "login"
                  ? "text-emerald-950"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab === "login" && (
                <motion.div
                  layoutId="active-auth-tab"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-neutral-200/50 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              Sign In
            </Button>
            <Button
              onClick={() => setTab("register")}
              variant="ghost"
              className={`flex-1 py-4.5 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 cursor-pointer ${
                tab === "register"
                  ? "text-emerald-950"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab === "register" && (
                <motion.div
                  layoutId="active-auth-tab"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-neutral-200/50 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              Register
            </Button>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "login" ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === "login" ? 12 : -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {tab === "login" ? <LoginForm /> : <RegisterForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
