import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import api, { setAccessToken } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setAccessToken);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const loginMutation = useMutation<
    { accessToken: string; user: User },
    AxiosError<{ message?: string }>,
    typeof formData
  >({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid credentials");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    loginMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 p-1">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-neutral-700 font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          className="bg-neutral-50/50 border-neutral-200 text-neutral-950 placeholder-neutral-400 focus-visible:ring-emerald-500 focus:ring-0 focus-visible:border-0 h-10 text-sm"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-neutral-700 font-medium">
            Password
          </Label>
          {/* <a
            href="#"
            className="text-sm text-neutral-500 hover:text-emerald-700 font-medium transition-colors"
          >
            Forgot password?
          </a> */}
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          className="bg-neutral-50/50 border-neutral-200 text-neutral-950 placeholder-neutral-400 focus-visible:ring-emerald-500 focus:ring-0 focus-visible:border-0 h-10 text-sm"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full text-base bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-lg transition-all shadow-sm shadow-emerald-600/10 active:scale-[0.99] cursor-pointer mt-2"
      >
        {loginMutation.isPending ? (
          <span className="flex items-center justify-center gap-2 text-base">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-200" />
            Authenticating...
          </span>
        ) : (
          "Sign In with Email"
        )}
      </Button>
    </form>
  );
}
