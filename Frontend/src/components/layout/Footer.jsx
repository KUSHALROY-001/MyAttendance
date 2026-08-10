import React from "react";
import { Link } from "react-router-dom";
import { Mail, Globe, Heart, ExternalLink, GraduationCap } from "lucide-react";

const GithubIcon = ({ className = "h-4 w-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 transition-colors dark:border-[#222228] dark:bg-[#0D0D0F]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  MyAttendance
                </span>
                <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  v1.0
                </span>
              </div>
            </div>
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
              A comprehensive multi-tenant attendance and academic management
              platform built for modern educational institutions.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Platform Systems Operational
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Features Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  About Platform
                </Link>
              </li>
              <li>
                <Link
                  to="/library"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Academic Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Roles */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Portals & Roles
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Teacher Workspace
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Admin Console
                </Link>
              </li>
              <li>
                <Link
                  to="/register-institute"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Register Institution
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Contact & Connect
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://github.com/KUSHALROY-001/MyAttendance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=kushalroy235@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Support</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KUSHALROY-001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Globe className="h-4 w-4" />
                  <span>Developer Profile</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} MyAttendance. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>by</span>
            <a
              href="https://github.com/KUSHALROY-001"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
            >
              Kushal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
