export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  category?: 'academics' | 'exams' | 'admissions' | 'facilities' | 'student-life' | 'general';
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
  status?: 'sent' | 'received' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface SuggestedQuestion {
  id: string;
  category: 'academics' | 'exams' | 'admissions' | 'facilities' | 'student-life';
  question: string;
  badge: string;
  iconName: string;
}

export interface CollegeDepartment {
  name: string;
  head: string;
  location: string;
  email: string;
  phone: string;
  officeHours: string;
}

export interface FacilityInfo {
  id: string;
  name: string;
  location: string;
  timing: string;
  features: string[];
  contact: string;
  icon: string;
}

export interface ExamNotice {
  id: string;
  title: string;
  date: string;
  details: string;
  category: 'Midterms' | 'Finals' | 'Backlog' | 'Admit Card';
  downloadable?: boolean;
}
