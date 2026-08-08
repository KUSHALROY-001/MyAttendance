import React from "react";
import { useNavigate } from "react-router-dom";

const PremiumErrorState = ({
  title = "Page Not Found",
  message = "The URL you are trying to access does not exist or has been moved.",
  errorCode = "404",
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl m-4 border border-slate-200 bg-white text-slate-900 shadow-xl transition-colors duration-300 dark:border-[#222228] dark:bg-[#151518] dark:text-slate-100">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none dark:bg-indigo-500/20"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none dark:bg-rose-500/15"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto p-8 animate-fadeInOut">
        {/* Error Code Graphic */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
          <div className="relative px-8 py-4 bg-slate-100/80 border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-md dark:bg-[#19191D] dark:border-[#222228]">
            <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-rose-500 dark:from-indigo-400 dark:to-rose-400 drop-shadow-lg tracking-tighter">
              {errorCode}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-base md:text-lg leading-relaxed">
          {message}
        </p>

        {/* Interactive Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-200 dark:hover:bg-[#26262B] dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumErrorState;
