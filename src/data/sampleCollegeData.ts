import { SuggestedQuestion, FacilityInfo, ExamNotice, CollegeDepartment } from '../types/campus';

export const COLLEGE_INFO = {
  name: 'Karnavati University',
  shortName: 'Karnavati University (KU)',
  tagline: 'A State Private University, Gandhinagar, Gujarat',
  established: 'Established under Gujarat Private Universities (Amendment) Act, 2017',
  recognition: 'UGC Recognized State Private University | Member of AIU (Association of Indian Universities)',
  campusAddress: 'A/907, Uvarsad-Vavol Road, Knowledge Village, At & Po. Uvarsad, Gandhinagar - 382422, Gujarat, India',
  website: 'https://karnavatiuniversity.edu.in/',
  tollFree: '1800 270 1206',
  boardLine: '+91-79-61755500',
  admissionsEmail: 'admissions@karnavatiuniversity.edu.in',
  generalEmail: 'info@karnavatiuniversity.edu.in',
  uitAdmissionsHelpline: '+91 7574811136 / +91 7574811135 / +91 9898203137 / +91 6358150869',
  currentSession: 'Academic Year 2025–2026 / Admissions 2026–2027',
};

export const QUICK_CATEGORIES = [
  { id: 'all', label: 'All KU Topics', icon: 'Sparkles', description: 'Complete official university guidance' },
  { id: 'uit-engineering', label: 'UIT & B.Tech', icon: 'Cpu', description: 'Unitedworld Institute of Technology programmes' },
  { id: 'academics', label: 'Academics & Schools', icon: 'BookOpen', description: 'Constituent schools, courses & curriculum' },
  { id: 'admissions', label: 'Admissions & Eligibility', icon: 'GraduationCap', description: 'Criteria, entrance tests & application process' },
  { id: 'exams', label: 'Exams & Academic Policies', icon: 'FileText', description: 'Evaluation, attendance rules & official circulars' },
  { id: 'facilities', label: 'Campus Facilities', icon: 'Building2', description: 'Hostels, libraries, computing labs & amenities' },
  { id: 'placements', label: 'Placements & Scholarships', icon: 'Award', description: 'Career services, recruiters & merit scholarships' },
] as const;

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  // UIT & B.Tech
  {
    id: 'uit-1',
    category: 'academics',
    question: 'What B.Tech programmes and specializations are offered by Unitedworld Institute of Technology (UIT)?',
    badge: 'UIT B.Tech',
    iconName: 'Cpu',
  },
  {
    id: 'uit-2',
    category: 'admissions',
    question: 'What is the eligibility and admission criteria for B.Tech CSE at UIT?',
    badge: 'UIT Admission',
    iconName: 'GraduationCap',
  },
  {
    id: 'uit-3',
    category: 'academics',
    question: 'Does UIT offer B.Tech in Data Science in association with Google Cloud?',
    badge: 'Specialization',
    iconName: 'Cpu',
  },
  {
    id: 'uit-4',
    category: 'facilities',
    question: 'What computing laboratories and technical infrastructure are available at UIT?',
    badge: 'UIT Labs',
    iconName: 'Building2',
  },

  // Constituent Schools & Academics
  {
    id: 'acad-1',
    category: 'academics',
    question: 'What constituent schools and institutes comprise Karnavati University?',
    badge: 'KU Schools',
    iconName: 'BookOpen',
  },
  {
    id: 'acad-2',
    category: 'academics',
    question: 'What programmes are offered by Unitedworld Institute of Design (UID) and Unitedworld School of Law (UWSL)?',
    badge: 'Programmes',
    iconName: 'BookOpen',
  },
  {
    id: 'acad-3',
    category: 'academics',
    question: 'What business and management programmes are offered by UIM (Unitedworld Institute of Management)?',
    badge: 'UIM Business',
    iconName: 'BookOpen',
  },

  // Admissions & Selection Process
  {
    id: 'adm-1',
    category: 'admissions',
    question: 'What is the complete admission process and selection procedure at Karnavati University?',
    badge: 'Admission Process',
    iconName: 'GraduationCap',
  },
  {
    id: 'adm-uit-process',
    category: 'admissions',
    question: 'What is the admission process, eligibility and entrance requirements for B.Tech at UIT?',
    badge: 'UIT B.Tech Admission',
    iconName: 'Cpu',
  },
  {
    id: 'adm-fee',
    category: 'admissions',
    question: 'Where can I find the verified tuition and hostel fee structure for my course?',
    badge: 'Fee Inquiries',
    iconName: 'FileText',
  },
  {
    id: 'adm-2',
    category: 'admissions',
    question: 'Are JEE Main or GUJCET scores accepted for engineering admissions at Karnavati University?',
    badge: 'Entrance Exams',
    iconName: 'GraduationCap',
  },
  {
    id: 'adm-3',
    category: 'admissions',
    question: 'What documents are required during physical admission verification at the Gandhinagar campus?',
    badge: 'Document List',
    iconName: 'GraduationCap',
  },

  // Examinations & Academic Policies
  {
    id: 'exam-1',
    category: 'exams',
    question: 'Where can students access official examination circulars, datesheets, and academic schedules?',
    badge: 'Exam Circulars',
    iconName: 'FileText',
  },
  {
    id: 'exam-2',
    category: 'exams',
    question: 'What are Karnavati University\'s attendance rules and academic eligibility policies for semester exams?',
    badge: 'Academic Policy',
    iconName: 'FileText',
  },

  // Campus Facilities
  {
    id: 'fac-1',
    category: 'facilities',
    question: 'What hostel accommodation and dining facilities are provided for students on campus?',
    badge: 'Hostels & Mess',
    iconName: 'Building2',
  },
  {
    id: 'fac-2',
    category: 'facilities',
    question: 'What are the features of the Karnavati University Central Library and learning resource centre?',
    badge: 'Library',
    iconName: 'Building2',
  },
  {
    id: 'fac-3',
    category: 'facilities',
    question: 'Is healthcare and medical assistance available on the Karnavati University campus?',
    badge: 'Health & Dental',
    iconName: 'Building2',
  },

  // Placements & Scholarships
  {
    id: 'place-1',
    category: 'student-life',
    question: 'How does the Karnavati University Corporate Resource Center (CRC) assist with student placements?',
    badge: 'Placements',
    iconName: 'Users',
  },
  {
    id: 'place-2',
    category: 'student-life',
    question: 'What merit scholarships and financial assistance schemes are offered by Karnavati University?',
    badge: 'Scholarships',
    iconName: 'Award',
  },

  // University Contacts
  {
    id: 'cont-1',
    category: 'student-life',
    question: 'What are the official contact numbers, email addresses, and campus location of Karnavati University?',
    badge: 'Contact Info',
    iconName: 'Phone',
  },
];

export const CAMPUS_FACILITIES: FacilityInfo[] = [
  {
    id: 'fac-uit-labs',
    name: 'UIT Advanced Computing & Technical Laboratories',
    location: 'Unitedworld Institute of Technology (UIT) Block',
    timing: 'Academic Hours & Scheduled Practical Lab Sessions',
    features: [
      'High-performance computing workstations equipped for AI, Data Science & Machine Learning',
      'Google Cloud integrated development environments and big data tools',
      'Cyber Security and Network Security simulation workstations',
      'IoT hardware prototyping kits, microcontrollers, and modern software engineering suites'
    ],
    contact: 'UIT Office: +91 7574811136 | info@karnavatiuniversity.edu.in',
    icon: 'Cpu',
  },
  {
    id: 'fac-library',
    name: 'Karnavati University Central Library & Resource Centre',
    location: 'Central Academic Complex, Uvarsad Campus',
    timing: 'Standard University Working Hours & Extended Hours During Term Exams',
    features: [
      'Vast repository of academic textbooks, reference works, research monographs, and design journals',
      'Digital e-library subscriptions providing access to national and international research portals',
      'Dedicated silent reading cubicles and collaborative group study areas',
      'Online catalogue system for easy book reservation and search'
    ],
    contact: 'info@karnavatiuniversity.edu.in | +91-79-61755500',
    icon: 'BookOpen',
  },
  {
    id: 'fac-hostels',
    name: 'Residential Hostels (Boys & Girls)',
    location: 'Karnavati University Campus, Uvarsad, Gandhinagar',
    timing: 'Round-the-clock secure accommodation with regulated campus entry',
    features: [
      'Separate residential blocks for male and female students with 24/7 security surveillance',
      'Furnished living spaces with study desks, storage, and Wi-Fi internet connectivity',
      'Hygienic dining mess serving breakfast, lunch, snacks, and dinner',
      'Common recreation rooms, laundry services, and resident warden oversight'
    ],
    contact: 'Hostel Administration via +91-79-61755500',
    icon: 'Building2',
  },
  {
    id: 'fac-health',
    name: 'Campus Healthcare & Dental Clinic (KSD Support)',
    location: 'Adjacent to Karnavati School of Dentistry (KSD) Complex',
    timing: 'Day OPD & Emergency First-Aid Response',
    features: [
      'Qualified medical staff for primary healthcare, first-aid, and routine consultations',
      'Supervised clinical support affiliated with Karnavati School of Dentistry',
      'Emergency ambulance liaison with prominent regional hospitals in Gandhinagar and Ahmedabad',
      'Periodic health awareness and wellness drives for students and faculty'
    ],
    contact: 'Reception Desk: +91-79-61755500',
    icon: 'HeartPulse',
  },
  {
    id: 'fac-sports',
    name: 'Sports Arenas & Gymnasium',
    location: 'Recreational Quadrangle, Uvarsad Campus',
    timing: 'Morning and Evening Student Recreational Hours',
    features: [
      'Outdoor sports grounds for cricket, football, and athletic activities',
      'Hardcourt spaces for basketball, volleyball, and badminton',
      'Well-equipped fitness gymnasium with strength and cardio equipment',
      'Venues for university cultural tournaments and annual student fests'
    ],
    contact: 'Sports Coordinator: info@karnavatiuniversity.edu.in',
    icon: 'Activity',
  },
  {
    id: 'fac-dining',
    name: 'University Cafeteria & Food Courts',
    location: 'Central Student Hub, Uvarsad Campus',
    timing: '7:30 AM – 9:00 PM Daily',
    features: [
      'Multiple food stations providing multi-cuisine vegetarian and healthy dining options',
      'Cafeteria outlets serving hot and cold beverages, refreshments, and snacks',
      'Spacious indoor and covered outdoor seating spaces for students and faculty'
    ],
    contact: 'General Admin: +91-79-61755500',
    icon: 'Utensils',
  },
];

export const RECENT_NOTICES: ExamNotice[] = [
  {
    id: 'ku-not-1',
    title: 'Admissions Open for Academic Year 2026–2027 at Karnavati University',
    date: 'Official Circular',
    category: 'Admit Card',
    details: 'Applications are invited for UIT (B.Tech in CSE with specializations in AI & ML, Data Science, Cyber Security), UID, UIM, UWSL, and other constituent institutes. Apply online via https://karnavatiuniversity.edu.in/.',
    downloadable: true,
  },
  {
    id: 'ku-not-2',
    title: 'Official Academic Schedules & Semester Examinations Notification',
    date: 'University Notice',
    category: 'Finals',
    details: 'Students are advised to review the official student ERP and institutional notice boards for their respective constituent school semester datesheets and hall ticket guidelines.',
    downloadable: true,
  },
  {
    id: 'ku-not-3',
    title: 'Merit Scholarships & Financial Assistance Guidelines 2026',
    date: 'Scholarship Desk',
    category: 'Midterms',
    details: 'Eligible candidates demonstrating academic excellence in Class 12 board examinations or recognized entrance exams (JEE Main/GUJCET) may apply for the Karnavati University Merit Scholarship Programme.',
    downloadable: true,
  },
  {
    id: 'ku-not-4',
    title: 'Mandatory Requisite Attendance & Academic Integrity Policy',
    date: 'Registrar Office',
    category: 'Backlog',
    details: 'In accordance with statutory and university academic regulations, students must maintain the prescribed attendance in lectures and practical sessions to be eligible to sit for term-end university examinations.',
    downloadable: false,
  },
];

export const COLLEGE_DEPARTMENTS: CollegeDepartment[] = [
  {
    name: 'Unitedworld Institute of Technology (UIT)',
    head: 'Dean / Head of Engineering Programmes',
    location: 'UIT Engineering Block, Uvarsad Campus, Gandhinagar',
    email: 'info@karnavatiuniversity.edu.in',
    phone: '+91 7574811136 / +91 7574811135',
    officeHours: 'Monday – Saturday: 9:00 AM – 5:00 PM',
  },
  {
    name: 'Unitedworld Institute of Design (UID)',
    head: 'Director / Dean of Design',
    location: 'UID Design Pavilion, Uvarsad Campus, Gandhinagar',
    email: 'admissions@karnavatiuniversity.edu.in',
    phone: '+91-79-61755500 / +91 9266663225',
    officeHours: 'Monday – Saturday: 9:00 AM – 5:00 PM',
  },
  {
    name: 'Unitedworld School of Law (UWSL)',
    head: 'Dean, School of Law',
    location: 'UWSL Academic Wing, Uvarsad Campus, Gandhinagar',
    email: 'info@karnavatiuniversity.edu.in',
    phone: '+91-79-61755500 / Toll Free: 1800 270 1206',
    officeHours: 'Monday – Saturday: 9:00 AM – 5:00 PM',
  },
  {
    name: 'Unitedworld Institute of Management (UIM / UWSB)',
    head: 'Dean, Management Studies',
    location: 'Management Studies Block, Uvarsad Campus, Gandhinagar',
    email: 'admissions@karnavatiuniversity.edu.in',
    phone: '+91-79-61755500',
    officeHours: 'Monday – Saturday: 9:00 AM – 5:00 PM',
  },
  {
    name: 'Corporate Resource Center (CRC) & Placement Cell',
    head: 'Head, Training & Corporate Relations',
    location: 'Central Career Services Office, Uvarsad Campus',
    email: 'placements@karnavatiuniversity.edu.in / info@karnavatiuniversity.edu.in',
    phone: '+91-79-61755500',
    officeHours: 'Monday – Friday: 9:30 AM – 5:30 PM',
  },
  {
    name: 'Office of Admissions & Student Information Desk',
    head: 'Admissions Director',
    location: 'Central Admission Welcome Center, Knowledge Village, Uvarsad, Gandhinagar',
    email: 'admissions@karnavatiuniversity.edu.in',
    phone: 'Toll-Free: 1800 270 1206 | +91-79-61755500',
    officeHours: 'Monday – Saturday: 9:00 AM – 5:30 PM',
  },
];
