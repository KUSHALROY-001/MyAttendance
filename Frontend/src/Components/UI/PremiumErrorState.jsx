import React from "react";
import { useNavigate } from "react-router-dom";

const PremiumErrorState = ({ 
  title = "Student Not Found", 
  message = "We couldn't locate the records for this roll number. Please double-check and try again.",
  errorCode = "404" 
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900 rounded-3xl m-4 shadow-2xl">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none text-indigo-500"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto p-8 animate-fadeInOut">
        {/* Error Code Graphic */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
          <div className="relative px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl">
            <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-rose-400 drop-shadow-lg tracking-tighter">
              {errorCode}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-400 mb-10 text-lg leading-relaxed">
          {message}
        </p>

        {/* Interactive Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="group relative px-6 py-3 font-semibold text-white bg-indigo-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 hover:-translate-y-1 focus:ring-4 focus:ring-indigo-500/50"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform ease-out duration-300"></div>
            <span className="relative flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 font-semibold text-indigo-300 bg-indigo-950/50 border border-indigo-500/30 rounded-xl hover:bg-indigo-900/50 hover:text-indigo-200 transition-all focus:ring-4 focus:ring-indigo-500/30"
          >
            Retry Validation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumErrorState;
