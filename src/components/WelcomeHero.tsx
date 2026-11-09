import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  GraduationCap,
  Building2,
  FileText,
  Users,
  Award,
  ArrowRight,
  Bell,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  COLLEGE_INFO,
  QUICK_CATEGORIES,
  SUGGESTED_QUESTIONS,
  RECENT_NOTICES,
} from '../data/sampleCollegeData';

interface WelcomeHeroProps {
  onSelectQuestion: (question: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onSelectQuestion,
  selectedCategory,
  onCategoryChange,
}) => {
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);

  const filteredQuestions =
    selectedCategory === 'all'
      ? SUGGESTED_QUESTIONS
      : selectedCategory === 'uit-engineering'
      ? SUGGESTED_QUESTIONS.filter((q) => q.id.startsWith('uit-'))
      : SUGGESTED_QUESTIONS.filter((q) => q.category === selectedCategory);

  const currentNotice = RECENT_NOTICES[activeNoticeIndex];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner & Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-sky-50 via-white to-sky-50/30 border border-sky-100 p-6 md:p-8 shadow-xs">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-semibold text-sky-800 border border-sky-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>CampusBot • AI Student Information Assistant</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome to Karnavati University
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              An AI-powered student information assistant referencing verified public information for <strong>Unitedworld Institute of Technology (UIT)</strong> B.Tech programmes, admissions, examinations, campus facilities, and student services in Gandhinagar, Gujarat.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <a
                href={COLLEGE_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-semibold underline underline-offset-2"
              >
                <span>Visit Official Website: karnavatiuniversity.edu.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Real University Recognition Badge */}
          <div className="shrink-0 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-sky-200 shadow-2xs text-center space-y-1.5">
            <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wider">
              State Private University
            </div>
            <div className="text-sm font-extrabold text-sky-700">
              UGC Recognized
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Member of AIU
            </div>
            <div className="text-[10px] text-slate-400 border-t border-sky-100 pt-1">
              Gandhinagar, Gujarat
            </div>
          </div>
        </div>

        {/* Featured Card: Unitedworld Institute of Technology (UIT) */}
        <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-sky-100/70 via-sky-50 to-white border border-sky-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wide">
                  Spotlight: Unitedworld Institute of Technology (UIT)
                </span>
                <span className="text-[10px] bg-sky-200 text-sky-900 font-semibold px-2 py-0.2 rounded-full">
                  B.Tech Engineering
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Offering <strong>B.Tech in Computer Science & Engineering</strong> with specializations in AI & ML, Data Science (in association with Google Cloud), Cyber Security, Cloud Computing, and Full Stack Development.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectQuestion('What B.Tech programmes and specializations are offered by Unitedworld Institute of Technology (UIT)?')}
            className="shrink-0 px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-800 text-xs font-semibold rounded-lg border border-sky-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Explore UIT B.Tech</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
          </button>
        </div>

        {/* Live Official Circular Ticker */}
        <div className="mt-4 pt-3 border-t border-sky-100/80 flex items-center gap-3 bg-white/70 p-3 rounded-xl border">
          <div className="shrink-0 p-1.5 bg-sky-50 rounded-lg text-sky-700 border border-sky-200">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider bg-sky-100 px-1.5 py-0.5 rounded">
                Official Circular
              </span>
              <span className="text-xs text-slate-500">
                {currentNotice.date}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              {currentNotice.title}
            </p>
          </div>
          <button
            onClick={() =>
              setActiveNoticeIndex((prev) => (prev + 1) % RECENT_NOTICES.length)
            }
            className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold shrink-0 cursor-pointer"
          >
            Next ({activeNoticeIndex + 1}/{RECENT_NOTICES.length})
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Select a Topic to View Verified University Questions</span>
          </h2>
          <span className="text-xs text-slate-500">
            {filteredQuestions.length} queries listed
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-800 border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredQuestions.map((sq) => {
          return (
            <button
              key={sq.id}
              onClick={() => onSelectQuestion(sq.question)}
              className="group text-left p-4 rounded-xl bg-white hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-xs transition flex flex-col justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-full border border-sky-200/50">
                    {sq.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-xs md:text-sm font-semibold text-slate-800 group-hover:text-sky-950 transition line-clamp-2">
                  {sq.question}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 group-hover:text-sky-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-sky-500" />
                <span>Verified university information</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Information Source & Scope Disclaimer */}
      <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>
          <span>
            <strong>Informational Assistant Notice:</strong> CampusBot is an independent AI-powered student information assistant referencing public data from <a href="https://karnavatiuniversity.edu.in/" target="_blank" rel="noreferrer" className="underline font-semibold text-sky-700">karnavatiuniversity.edu.in</a>. It is not an officially authorized administrative spokesperson. For formal invoices or official exam circulars, consult the university desk.
          </span>
        </div>
        <span className="hidden sm:inline text-slate-400 text-[11px] shrink-0 font-mono">
          Student Info Assistant
        </span>
      </div>
    </div>
  );
};
