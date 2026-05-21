import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, FileText, Sparkles, AlertTriangle, X, Brain, Trophy, MoveRight, Zap, Lightbulb
} from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import confetti from "canvas-confetti";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  message: string;
  analysis: {
    atsScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    aiFeedback: string;
    jobDescription: string;
    analyzedText: string;
  };
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult["analysis"] | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const analyzeMutation = useMutation<
    AnalysisResult,
    Error,
    { file: File; jobDescription: string }
  >({
    mutationFn: async ({ file, jobDescription }) => {
      // 1. Upload the resume file to the resume-service to extract text
      const formData = new FormData();
      formData.append("resume", file);

      const uploadResponse = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resume = uploadResponse.data.resume;

      // 2. Call the ats-service to perform deep AI evaluation on the extracted text
      const analyzeResponse = await api.post("/ats/analyze", {
        resumeId: resume.id || resume._id,
        resumeText: resume.extractedText,
        jobDescription,
      });

      return analyzeResponse.data;
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      toast.success("Resume analyzed successfully!");
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    },
    onError: (err) => {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || err.message || "Failed to analyze resume";
      toast.error(message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const executeAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    analyzeMutation.mutate({ file, jobDescription });
  };

  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const score = analysis?.atsScore || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 selection:bg-emerald-100 pb-24 relative overflow-hidden">
      {/* Premium Background Ambient Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Navbar />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-12 relative z-10">
        
        {/* Top Header Panel */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/40 text-emerald-800 text-xs font-bold shadow-xs"
          >
            <Sparkles className="h-3 w-3 animate-pulse text-emerald-600" /> LLM-v4 Evaluation Matrix
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-950"
          >
            Core Resume Diagnostics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-neutral-500 font-medium leading-relaxed"
          >
            Audit parameters, cross-examine critical missing stack vectors, and benchmark scoring metrics instantly.
          </motion.p>
        </div>

        {/* Input Configuration Grid (Shadcn Custom Emulated Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT COMPONENT: File Uploader Box */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">Document Source</h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Provide your current resume profile data</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center min-h-[180px]">
              {!file ? (
                <motion.div 
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className={`flex-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all relative group cursor-pointer ${
                    isDragging ? "border-emerald-600 bg-emerald-50/10" : "border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50/70 hover:border-neutral-300"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                      if (droppedFile.size > 5 * 1024 * 1024) {
                        toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
                        return;
                      }
                      setFile(droppedFile);
                    }
                  }}
                >
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                  <div className="h-11 w-11 rounded-xl bg-white border border-neutral-200/60 flex items-center justify-center text-neutral-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all mb-3 shadow-2xs">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-neutral-800">Drop resume file here or click</p>
                  <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Supports PDF, DOCX, TXT up to 5MB</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-emerald-50/10 border border-emerald-100/80 rounded-xl text-center relative">
                  <button type="button" onClick={() => setFile(null)} className="absolute top-3 right-3 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/10">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-neutral-900 max-w-[220px] truncate">{file.name}</p>
                  <p className="text-xs text-neutral-400 font-semibold mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT COMPONENT: Shadcn Emulated Textarea Card */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">Target vacancies description</h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Paste vacancy rules to optimize alignment matching vectors</p>
            </div>
            
            {/* Shadcn UI Styled Textarea field element */}
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g., Seeking a MERN Stack Developer proficient with React.js, Node.js, Express, and Prisma database structures..."
              className="w-full flex-1 min-h-[180px] p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 text-neutral-900 placeholder-neutral-400 transition-all resize-none shadow-2xs leading-relaxed"
            />
          </div>

        </div>

        {/* Dynamic Massive Action Trigger Button & Loader Progress Area */}
        <div className="w-full space-y-5">
          <Button
            onClick={executeAnalysis}
            disabled={!file || analyzeMutation.isPending}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-100 text-white disabled:text-neutral-400 font-bold text-base rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.995] flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed border-none"
          >
            <Sparkles className={`h-4 w-4 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
            Assemble & Analyze Core Profile
            <MoveRight className="h-4 w-4 opacity-80" />
          </Button>

          {/* Luxury High-End Scanning Animation Loader */}
          <AnimatePresence>
            {analyzeMutation.isPending && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-white border border-neutral-200/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm"
              >
                {/* Advanced Pulsing Radar Frame */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Brain className="h-5 w-5 animate-pulse" />
                  <span className="absolute inset-0 rounded-xl bg-emerald-500/10 animate-ping" />
                </div>

                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h4 className="text-sm font-bold text-neutral-900">Analyzing your Resume...</h4>
                  <p className="text-xs text-neutral-400 font-medium">We are matching your skills, scanning for gaps, and calculating your score.</p>
                </div>

                {/* Laser Moving Progress Bar Tracker */}
                <div className="relative h-[3px] w-full max-w-sm bg-neutral-100 rounded-full overflow-hidden mt-1">
                  <motion.div 
                    className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                    animate={{ left: ["-30%", "130%"] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* OUTPUT MATRIX GENERATION REPORT CONTAINER */}
        <AnimatePresence>
          {analysis && !analyzeMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 130 }}
              className="space-y-6 pt-2"
            >
              {/* Executive Overview Container Card */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
                
                {/* SVG Luxury Circle Gauge Metric */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative flex items-center justify-center h-40 w-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r={radius} className="text-neutral-100" strokeWidth={strokeWidth} fill="transparent" stroke="currentColor" />
                      <motion.circle 
                        cx="60" cy="60" r={radius} 
                        className="text-emerald-600" 
                        strokeWidth={strokeWidth} 
                        fill="transparent" 
                        stroke="currentColor"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-5xl font-black text-neutral-950 tracking-tight">{score}</span>
                      <span className="text-[10px] block font-bold text-neutral-400 tracking-wider uppercase mt-1">ATS Score</span>
                    </div>
                  </div>
                </div>

                {/* Metadata Output Text Description */}
                <div className="md:col-span-8 text-center md:text-left space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/40 w-fit">
                    <Trophy className="h-3.5 w-3.5 text-emerald-600" /> Analysis Complete
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-950 tracking-tight">Evaluation Summary</h3>
                  <p className="text-sm sm:text-base text-neutral-500 font-medium leading-relaxed">
                    Your resume matches <strong className="text-emerald-700 font-bold">{score}%</strong> of the job description criteria. Review the skills below to optimize your profile.
                  </p>
                </div>
              </div>

              {/* Tag Component Grid (Matched vs Missing Capability Arrays) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Matched Capabilities Box */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 tracking-tight">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/40" /> Matched Skills ({analysis.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedSkills.map((skill, index) => (
                      <span key={index} className="text-xs font-semibold bg-emerald-50/60 border border-emerald-200/40 text-emerald-800 px-3 py-1 rounded-lg transition-colors hover:bg-emerald-50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Capabilities Box */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 tracking-tight">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shadow-xs shadow-amber-500/40" /> Missing Skills ({analysis.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingSkills.map((skill, index) => (
                      <span key={index} className="text-xs font-semibold bg-amber-50/60 border border-amber-200/40 text-amber-800 px-3 py-1 rounded-lg transition-colors hover:bg-amber-50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Deep Feedback Summary Section */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-neutral-950 flex items-center gap-2 tracking-tight">
                  <Brain className="h-4 w-4 text-emerald-600" /> Detailed AI Feedback
                </h4>
                <div className="text-sm text-neutral-600 font-medium leading-relaxed bg-neutral-50/40 p-4 rounded-xl border border-neutral-200/40">
                  {analysis.aiFeedback}
                </div>
              </div>

              {/* Three-Column Structured Summary Layout row details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths Card */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4 flex flex-col shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider border-b border-neutral-100 pb-2">
                    <Zap className="h-4 w-4" /> Key Strengths
                  </div>
                  <ul className="text-xs font-semibold text-neutral-600 list-disc list-inside space-y-2 pl-0.5 leading-relaxed">
                    {analysis.strengths.map((item, idx) => (
                      <li key={idx} className="marker:text-emerald-400">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses Card */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4 flex flex-col shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider border-b border-neutral-100 pb-2">
                    <AlertTriangle className="h-4 w-4" /> Areas to Improve
                  </div>
                  <ul className="text-xs font-semibold text-neutral-600 list-disc list-inside space-y-2 pl-0.5 leading-relaxed">
                    {analysis.weaknesses.map((item, idx) => (
                      <li key={idx} className="marker:text-amber-400">{item}</li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Suggestions Card (Full Width Below) */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4 flex flex-col shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">
                  <Lightbulb className="h-4 w-4 text-neutral-900" /> Action Plan
                </div>
                <ul className="text-xs font-semibold text-neutral-600 list-disc list-inside space-y-2 pl-0.5 leading-relaxed">
                  {analysis.suggestions.map((item, idx) => (
                    <li key={idx} className="marker:text-neutral-400">{item}</li>
                  ))}
                </ul>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}