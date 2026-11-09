import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Search,
  Cpu,
  BookOpen,
  FileText,
  GraduationCap,
  Building2,
  Users,
  Award,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { ChatSession } from '../types/campus';
import { COLLEGE_INFO } from '../data/sampleCollegeData';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onSelectCategory: (category: string) => void;
  onOpenDirectory: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onSelectCategory,
  onOpenDirectory,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.messages.some((m) => m.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 lg:w-80 bg-white border-r border-sky-100 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: New Question + Search */}
        <div className="p-4 border-b border-sky-100 space-y-3 bg-sky-50/40">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-sky-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New University Inquiry</span>
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-sky-200/80 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* Middle: Chat History Sessions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 pb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Conversations</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
              {filteredSessions.length}
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 italic">
              {searchTerm ? 'No matching inquiries' : 'No previous inquiry history'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition ${
                    isActive
                      ? 'bg-sky-50 text-sky-950 font-semibold border border-sky-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-sky-600'
                      }`}
                    />
                    <span className="truncate">{session.title || 'KU Inquiry'}</span>
                  </div>

                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                    title="Delete session"
                    aria-label="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                  </button>
                </div>
              );
            })
          )}

          {/* Quick Categories Section */}
          <div className="pt-4 px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            KU Sections
          </div>
          <div className="space-y-0.5">
            {[
              { id: 'uit-engineering', label: 'UIT – B.Tech Engineering', icon: Cpu },
              { id: 'admissions', label: 'Admissions & Eligibility', icon: GraduationCap },
              { id: 'academics', label: 'Schools & Courses', icon: BookOpen },
              { id: 'exams', label: 'Examinations & Policies', icon: FileText },
              { id: 'facilities', label: 'Hostels & Campus Facilities', icon: Building2 },
              { id: 'placements', label: 'Placements & Scholarships', icon: Award },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-600 hover:bg-sky-50 hover:text-sky-800 transition text-left cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-sky-600" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Official Helplines */}
        <div className="p-3 border-t border-sky-100 bg-sky-50/50">
          <div className="bg-white p-3 rounded-xl border border-sky-100/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                Karnavati Campus Desk
              </span>
              <span className="text-[10px] text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded font-semibold">
                Gandhinagar
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Knowledge Village, Uvarsad, Gandhinagar - 382422, Gujarat
            </p>

            <a
              href="tel:18002701206"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-semibold border border-sky-200 transition"
            >
              <Phone className="w-3 h-3 text-sky-600" />
              <span>Toll-Free: 1800 270 1206</span>
            </a>

            <button
              onClick={() => {
                onOpenDirectory();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-1 text-[11px] text-sky-700 hover:text-sky-900 font-medium py-1 transition cursor-pointer"
            >
              <span>View KU Schools & Directory</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
