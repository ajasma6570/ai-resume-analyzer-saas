import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="inline-flex p-4 bg-red-50 text-red-500 rounded-full mb-6">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="text-6xl font-extrabold text-neutral-900 tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-all shadow-sm active:scale-[0.98]">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
