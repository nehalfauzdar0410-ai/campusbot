import React, { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  Building2,
  FileText,
  PhoneCall,
  Clock,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  COLLEGE_INFO,
  CAMPUS_FACILITIES,
  RECENT_NOTICES,
  COLLEGE_DEPARTMENTS,
} from '../data/sampleCollegeData';

interface CampusDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutItem: (topic: string) => void;
}

export const CampusDirectoryModal: React.FC<CampusDirectoryModalProps> = ({
  isOpen,
  onClose,
  onAskAboutItem,
}) => {
  const [activeTab, setActiveTab] = useState<'departments' | 'facilities' | 'notices' | 'emergency'>('departments');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-sky-100 bg-linear-to-r from-sky-50 to-white flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Karnavati University Directory & Constituent Schools
              </h2>
              <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                Gandhinagar, Gujarat
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Official constituent institutes, UIT engineering departments, facilities, circulars, and helplines.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Close directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Search */}
        <div className="p-3 sm:px-6 border-b border-sky-100 bg-sky-50/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'departments', label: 'Schools & UIT', icon: BookOpen },
              { id: 'facilities', label: 'Campus Facilities', icon: Building2 },
              { id: 'notices', label: 'Official Circulars', icon: FileText },
              { id: 'emergency', label: 'University Helplines', icon: PhoneCall },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white hover:text-sky-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60 pl-9 pr-3 py-1.5 bg-white border border-sky-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: CONSTITUENT SCHOOLS & DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COLLEGE_DEPARTMENTS.filter(
                (d) =>
                  d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  d.head.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((dept, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-sky-100 bg-white hover:border-sky-300 shadow-2xs hover:shadow-xs transition space-y-3"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
                    <p className="text-xs text-sky-700 font-medium mt-0.5">{dept.head}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dept.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dept.officeHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${dept.email}`} className="text-sky-600 hover:underline">
                        {dept.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dept.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAskAboutItem(`Tell me more about programmes and admission in ${dept.name}`);
                      onClose();
                    }}
                    className="w-full mt-2 py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-lg transition text-center cursor-pointer"
                  >
                    Ask CampusBot about this institute
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAMPUS_FACILITIES.filter(
                (f) =>
                  f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  f.features.some((feat) => feat.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((fac) => (
                <div
                  key={fac.id}
                  className="p-4 rounded-xl border border-sky-100 bg-white hover:border-sky-300 shadow-2xs hover:shadow-xs transition space-y-3"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{fac.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{fac.location}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-sky-50/70 rounded-lg text-xs text-sky-900 font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{fac.timing}</span>
                  </div>

                  <ul className="space-y-1 text-xs text-slate-600">
                    {fac.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      onAskAboutItem(`What are the facilities and details for ${fac.name}?`);
                      onClose();
                    }}
                    className="w-full mt-2 py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-lg transition text-center cursor-pointer"
                  >
                    Ask CampusBot about this facility
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-3">
              {RECENT_NOTICES.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 rounded-xl border border-sky-100 bg-white hover:border-sky-200 transition space-y-2 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                        {notice.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{notice.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{notice.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{notice.details}</p>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onAskAboutItem(`Please explain the notification regarding: ${notice.title}`);
                        onClose();
                      }}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
                    >
                      Ask CampusBot for details →
                    </button>
                    <a
                      href={COLLEGE_INFO.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Check on University Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: HELPLINES & CONTACTS */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-sky-900">
                  <PhoneCall className="w-4 h-4 text-sky-700" />
                  <span>Karnavati University Admissions & Information Desk</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For admissions inquiries across UIT, UID, UIM, UWSL, and general university assistance:
                </p>
                <div className="text-xl font-extrabold text-sky-800">
                  Toll-Free: 1800 270 1206 | Board Line: +91-79-61755500
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-sky-100 bg-white space-y-1">
                  <div className="font-bold text-slate-900">Unitedworld Institute of Technology (UIT)</div>
                  <p className="text-slate-500">Engineering Admissions Helplines</p>
                  <p className="font-bold text-sky-700">+91 7574811136 / +91 7574811135</p>
                  <p className="font-medium text-slate-600">+91 9898203137 / +91 6358150869</p>
                </div>

                <div className="p-3.5 rounded-xl border border-sky-100 bg-white space-y-1">
                  <div className="font-bold text-slate-900">Official Admissions Office</div>
                  <p className="text-slate-500">Direct admission email</p>
                  <p className="font-bold text-sky-700">admissions@karnavatiuniversity.edu.in</p>
                </div>

                <div className="p-3.5 rounded-xl border border-sky-100 bg-white space-y-1">
                  <div className="font-bold text-slate-900">Campus Address</div>
                  <p className="text-slate-500">A/907, Uvarsad-Vavol Road, Knowledge Village</p>
                  <p className="font-bold text-slate-800">Uvarsad, Gandhinagar - 382422, Gujarat</p>
                </div>

                <div className="p-3.5 rounded-xl border border-sky-100 bg-white space-y-1">
                  <div className="font-bold text-slate-900">Official Web Portal</div>
                  <p className="text-slate-500">Primary University Source</p>
                  <a
                    href="https://karnavatiuniversity.edu.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>karnavatiuniversity.edu.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sky-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{COLLEGE_INFO.campusAddress}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
