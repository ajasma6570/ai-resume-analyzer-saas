import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, User as UserIcon, Mail, Shield, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

export default function Settings() {
  const queryClient = useQueryClient();
  const setUserStore = useAuthStore((state) => state.setUser);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: profile, isLoading } = useQuery<{ user: User }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/user/profile");
      return response.data;
    },
  });

  // Sync loaded user profile to local state
  useEffect(() => {
    if (profile?.user) {
      setName(profile.user.name);
      setEmail(profile.user.email);
    }
  }, [profile]);

  const updateProfileMutation = useMutation<
    { user: User; message: string },
    Error,
    { name: string; email: string }
  >({
    mutationFn: async (updatedData) => {
      const response = await api.put("/user/profile", updatedData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Settings updated successfully!");
      // Sync with react-query cache and zustand store
      queryClient.setQueryData(["profile"], { user: data.user });
      setUserStore(data.user);
    },
    onError: (err) => {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || err.message || "Failed to update profile";
      toast.error(message);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("All fields are required");
      return;
    }
    updateProfileMutation.mutate({ name, email });
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 selection:bg-emerald-100 pb-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10 relative z-10">
        
        {/* Header Section */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 flex items-center gap-2.5">
            <SettingsIcon className="h-7 w-7 text-emerald-600 animate-spin-slow" />
            Account Settings
          </h1>
          <p className="text-sm text-neutral-500 font-semibold">
            Manage your personal profile details and subscription preferences.
          </p>
        </div>

        {/* Card Panel */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
          
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="h-12 bg-neutral-200 rounded-xl w-32" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Form Input 1: Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-neutral-700 font-semibold text-xs flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-neutral-400" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="bg-neutral-50/50 border-neutral-200 text-neutral-950 placeholder-neutral-400 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 h-10 text-sm font-semibold"
                />
              </div>

              {/* Form Input 2: Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-neutral-700 font-semibold text-xs flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="bg-neutral-50/50 border-neutral-200 text-neutral-950 placeholder-neutral-400 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 h-10 text-sm font-semibold"
                />
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 text-sm rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.995] flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>

            </form>
          )}

          {/* Account Tier Info Section */}
          <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  Premium Tier Account
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                </h4>
                <p className="text-xs text-neutral-400 font-semibold">
                  You have full unlimited access to evaluation diagnostics.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
