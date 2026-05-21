import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  History as HistoryIcon,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Zap,
  AlertTriangle,
  Lightbulb,
  Brain,
  Search,
} from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

interface AnalysisRecord {
  _id: string;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  aiFeedback: string;
  jobDescription: string;
  createdAt: string;
}

export default function History() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: analyses = [], isLoading } = useQuery<AnalysisRecord[]>({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await api.get("/ats/history");
      // Mongoose returns the list of analyses, adjust if response structure differs
      return response.data.analyses || [];
    },
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredAnalyses = analyses.filter((item) =>
    item.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 selection:bg-emerald-100 pb-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-black tracking-tight text-neutral-950 flex items-center gap-2.5">
              <HistoryIcon className="h-7 w-7 text-emerald-600" />
              Analysis History
            </h1>
            <p className="text-sm text-neutral-500 font-semibold">
              Browse and review all your previous resume assessments.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by job description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm font-medium bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all shadow-2xs placeholder-neutral-400 text-neutral-900"
            />
          </div>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-white border border-neutral-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
            <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <FileText className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-xs mx-auto">
              <h3 className="text-sm font-bold text-neutral-900">No evaluations found</h3>
              <p className="text-xs text-neutral-400 font-medium">
                {searchQuery ? "No matches for your search term." : "Upload a resume on the dashboard to trigger your first evaluation."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((item) => {
              const isExpanded = expandedId === item._id;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={item._id}
                  layout
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-2xs transition-all hover:border-neutral-300"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpand(item._id)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 max-w-lg">
                        <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                          {item.jobDescription || "Standard Resume Evaluation"}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      {/* ATS Score Badge */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100/60 text-emerald-700 font-extrabold text-sm shadow-2xs">
                          {item.atsScore}
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                          Score
                        </span>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expandable Section */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="border-t border-neutral-100 bg-neutral-50/10"
                      >
                        <div className="p-6 sm:p-8 space-y-6">
                          
                          {/* Matched vs Missing grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Matched */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-3.5 shadow-2xs">
                              <h5 className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Matched Skills ({item.matchedSkills.length})
                              </h5>
                              <div className="flex flex-wrap gap-1.5">
                                {item.matchedSkills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] font-bold bg-emerald-50/60 border border-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Missing */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-3.5 shadow-2xs">
                              <h5 className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                Missing Skills ({item.missingSkills.length})
                              </h5>
                              <div className="flex flex-wrap gap-1.5">
                                {item.missingSkills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] font-bold bg-amber-50/60 border border-amber-100 text-amber-800 px-2.5 py-1 rounded-lg"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                          </div>

                          {/* Detailed Feedback */}
                          <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-3 shadow-2xs">
                            <h5 className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                              <Brain className="h-4 w-4 text-emerald-600" />
                              Detailed AI Feedback
                            </h5>
                            <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                              {item.aiFeedback}
                            </p>
                          </div>

                          {/* Strengths & Weaknesses row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Strengths */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-3.5 shadow-2xs">
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider border-b border-neutral-100 pb-2">
                                <Zap className="h-3.5 w-3.5" /> Key Strengths
                              </div>
                              <ul className="text-xs font-semibold text-neutral-500 list-disc list-inside space-y-1.5 pl-0.5 leading-relaxed">
                                {item.strengths.map((str, idx) => (
                                  <li key={idx} className="marker:text-emerald-400">{str}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-3.5 shadow-2xs">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider border-b border-neutral-100 pb-2">
                                <AlertTriangle className="h-3.5 w-3.5" /> Areas to Improve
                              </div>
                              <ul className="text-xs font-semibold text-neutral-500 list-disc list-inside space-y-1.5 pl-0.5 leading-relaxed">
                                {item.weaknesses.map((wk, idx) => (
                                  <li key={idx} className="marker:text-amber-400">{wk}</li>
                                ))}
                              </ul>
                            </div>

                          </div>

                          {/* Suggestions / Action Plan */}
                          <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-3.5 shadow-2xs">
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">
                              <Lightbulb className="h-3.5 w-3.5 text-neutral-900" /> Action Plan
                            </div>
                            <ul className="text-xs font-semibold text-neutral-500 list-disc list-inside space-y-2 pl-0.5 leading-relaxed">
                              {item.suggestions.map((sug, idx) => (
                                <li key={idx} className="marker:text-neutral-400">{sug}</li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
