import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation<
    { message: string },
    AxiosError<{ message?: string }>,
    typeof formData
  >({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Registration completed successfully!");
      setFormData({ name: "", email: "", password: "" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    registerMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 p-1">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-neutral-700 font-medium text-xs">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          required
          className="bg-neutral-50/50 border-neutral-200 text-neutral-950 placeholder-neutral-400 focus-visible:ring-emerald-500 focus:ring-0 focus-visible:border-0 h-10 text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="reg-email"
          className="text-neutral-700 font-medium text-xs"
        >
          Email Address
        </Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          required
          className="bg-neutral-50/50 border-neutral-200 text-neutral-950 placeholder-neutral-400 focus-visible:ring-emerald-500 focus:ring-0 focus-visible:border-0 h-10 text-sm"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="reg-password"
          className="text-neutral-700 font-medium text-xs"
        >
          Password
        </Label>
        <Input
          id="reg-password"
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
        disabled={registerMutation.isPending}
        className="w-full text-base bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-lg transition-all shadow-sm shadow-emerald-600/10 active:scale-[0.99] cursor-pointer mt-2"
      >
        {registerMutation.isPending ? (
          <span className="flex items-center justify-center gap-2 text-base">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-200" />
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
