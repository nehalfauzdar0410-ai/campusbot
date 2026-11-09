import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpenCheck,
  Plus,
  Trash2,
  Menu,
  X,
  PhoneCall,
  Download,
  ExternalLink,
} from 'lucide-react';
import { COLLEGE_INFO } from '../data/sampleCollegeData';

interface HeaderProps {
  onNewChat: () => void;
  onClearChat: () => void;
  onOpenDirectory: () => void;
  onExportChat: () => void;
  hasMessages: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onClearChat,
  onOpenDirectory,
  onExportChat,
  hasMessages,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Mobile Toggle + Logo & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 focus:outline-hidden transition cursor-pointer"
            aria-label="Toggle navigation history"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-100">
              <GraduationCap className="w-5 h-5" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-linear-to-r from-sky-900 via-sky-700 to-blue-800 bg-clip-text text-transparent">
                  CampusBot
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-800 rounded-full border border-sky-200">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  AI Student Assistant
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate max-w-[190px] sm:max-w-xs md:max-w-md">
                Karnavati University • Gandhinagar, Gujarat
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Quick Badges & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Official Website link */}
          <a
            href={COLLEGE_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg border border-slate-200 transition"
            title="Open official Karnavati University website"
          >
            <span>karnavatiuniversity.edu.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Directory Button */}
          <button
            onClick={onOpenDirectory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50/80 hover:bg-sky-100/90 rounded-lg border border-sky-200/80 transition shadow-2xs cursor-pointer"
            title="Open Karnavati University Directory, UIT & Schools"
          >
            <BookOpenCheck className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">KU Directory</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/25 transition cursor-pointer"
            title="Start fresh conversation"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Question</span>
          </button>

          {/* Export Transcript */}
          {hasMessages && (
            <button
              onClick={onExportChat}
              className="p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition cursor-pointer"
              title="Download verified chat transcript"
              aria-label="Download transcript"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Clear Chat Button */}
          {hasMessages && (
            <button
              onClick={onClearChat}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Clear current conversation"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Toll-Free Quick Hotline */}
          <a
            href="tel:18002701206"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition"
            title="Toll-Free Admission Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
            <span>1800 270 1206</span>
          </a>
        </div>
      </div>
    </header>
  );
};
