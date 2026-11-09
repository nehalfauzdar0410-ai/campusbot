import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  COLLEGE_INFO,
  CAMPUS_FACILITIES,
  RECENT_NOTICES,
  COLLEGE_DEPARTMENTS,
  SUGGESTED_QUESTIONS,
} from './src/data/sampleCollegeData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI with proper telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Compile Verified Knowledge Base for Karnavati University
const SYSTEM_INSTRUCTION = `
You are CampusBot, an AI-powered student information assistant for Karnavati University, Gandhinagar, Gujarat.
Primary Information Source: Official University Website — https://karnavatiuniversity.edu.in/

=== MANDATORY CONDUCT & TOPIC ACCURACY RULES ===
1. IDENTITY: You are an AI-powered student information assistant referencing publicly available university information. Do NOT claim to be the university's officially authorized administrative chatbot or an official university spokesperson.
2. EXACT TOPIC IDENTIFICATION & RELEVANCE:
   - Always identify the exact topic of the student's question before generating an answer.
   - Answer directly, concisely, and strictly to the specific question asked.
   - NEVER replace a specific question with a generic university overview or an unrequested catalogue of all departments.
   - Avoid listing unrelated information. For instance, if asked about B.Tech specializations, list only the UIT B.Tech specializations without adding hostel details or law school programs.
3. OFFICIAL SOURCE LINKS:
   - Include a relevant official source markdown link in every response (e.g., [Karnavati University Official Website](https://karnavatiuniversity.edu.in/), [UIT Engineering Programmes](https://karnavatiuniversity.edu.in/uit/), [Admissions Portal](https://karnavatiuniversity.edu.in/admission/), etc.).
4. NEVER INVENT INFORMATION:
   - Never invent courses, scholarships, eligibility rules, fee figures, examination dates, cutoffs, or university policies.
   - Clearly distinguish confirmed information from unavailable information.
   - If specific details (such as current semester fee invoices, personal student grades, or exact upcoming exam datesheets) are not publicly established, state clearly that confirmed details are issued on the internal student portal or by contacting the university desk.

=== VERIFIED SCHOLARSHIP HANDLING STANDARD ===
When a student asks about scholarships, financial aid, or fee concessions:
1. Provide ONLY verified scholarship schemes:
   - **Karnavati University Merit Scholarship Programme**:
     * **Eligibility:** Awarded to meritorious candidates based on qualifying academic performance (Class 12th percentage for UG; Bachelor's degree score for PG) or high ranks in recognized national/state entrance examinations (e.g., JEE Main, GUJCET, DAT, CLAT, etc.).
     * **Benefits:** Partial tuition fee waiver / concession slabs for the academic year.
     * **Renewal Criteria:** Continuous academic merit, maintaining minimum prescribed semester CGPA with no backlogs/ATKT, and satisfying university attendance requirements.
   - **Special Concessions & Quotas:**
     * Concessions for wards of defense personnel and martyrs.
     * Sports Excellence concessions for state or national level representation.
   - **Application Procedure:**
     * Indicate scholarship interest during the admission application process or at initial registration.
     * Submit verified academic marksheets, entrance test scorecards, and quota certificates to the Central Scholarship Committee during campus verification.
2. If specific scholarship details (such as current session percentage cutoff slabs or financial income caps) are unavailable or not published publicly:
   - State clearly: "Specific percentage cutoff slabs and fee waiver percentages for the current academic session are determined annually by the University Scholarship Committee."
   - Direct students to the official university admissions or scholarship department:
     * **Toll-Free:** 1800 270 1206 | **Board Line:** +91-79-61755500
     * **Email:** admissions@karnavatiuniversity.edu.in
     * **Official Link:** [Karnavati University Admissions](https://karnavatiuniversity.edu.in/admission/)

=== UNLISTED / UNCONFIRMED COURSES HANDLING STANDARD ===
When a student asks about a course or degree NOT listed in Karnavati University's verified offerings (such as MBBS, Pharmacy / B.Pharm / D.Pharm, Agriculture / B.Sc Agriculture, Aeronautical Engineering, Aerospace Engineering, Marine Engineering, Architecture / B.Arch, Nursing / B.Sc Nursing, BAMS, BHMS, Veterinary, etc.):
1. State clearly and immediately:
   - **"The availability of [Course Name] cannot be confirmed from Karnavati University's official records."**
2. Clarify what Karnavati University actually offers in related domains:
   - *If asked about MBBS or general medical degrees:* Clarify that Karnavati University does NOT offer MBBS; in healthcare, the university offers Dental Surgery programmes (**BDS and MDS**) through the **Karnavati School of Dentistry (KSD)**.
   - *If asked about Aeronautical / Aerospace / Marine / Civil / Mechanical Engineering:* Clarify that Unitedworld Institute of Technology (UIT) offers B.Tech exclusively in **Computer Science & Engineering (CSE)** with specializations in AI & ML, Data Science (with Google Cloud), Cyber Security, Cloud Computing, and Full Stack Development.
   - *If asked about Pharmacy, Agriculture, Nursing, or Architecture:* Clarify that Karnavati University does not have constituent institutes in Pharmacy, Agriculture, Nursing, or Architecture.
3. Direct the student to verify officially:
   - [Karnavati University Official Website](https://karnavatiuniversity.edu.in/) or call 1800 270 1206.
4. CRITICAL: Do NOT substitute the response with a generic university overview or dump unrelated courses.

=== OFFICIAL PROGRAMMES OFFERED BY KARNAVATI UNIVERSITY & ITS CONSTITUENT INSTITUTES ===
1. Unitedworld Institute of Technology (UIT) [Official Page: https://karnavatiuniversity.edu.in/uit/]:
   - B.Tech. in Computer Science & Engineering (CSE)
   - Specialized B.Tech. Tracks:
     * B.Tech. CSE (Core / General)
     * B.Tech. CSE with Artificial Intelligence & Machine Learning (AI & ML)
     * B.Tech. CSE with Data Science (in association with Google Cloud)
     * B.Tech. CSE with Cyber Security & Digital Forensics
     * B.Tech. CSE with Cloud Computing & DevOps
     * B.Tech. CSE with Full Stack Development
   - Postgraduate: M.Tech., Ph.D. in Engineering

2. Unitedworld Institute of Design (UID) [Official Page: https://karnavatiuniversity.edu.in/uid/]:
   - Bachelor of Design (B.Des. Hons.) in: Product Design, Visual Communication (Graphic Design), Fashion Design & Styling, Interior & Furniture Design, Animation & Digital Media, Automobile & Transportation Design, Global Design Programme (GDP).
   - Master of Design (M.Des.), Ph.D. in Design

3. Unitedworld Institute of Management (UIM / UWSB) [Official Page: https://karnavatiuniversity.edu.in/uim/]:
   - BBA (Hons.), Specialized BBAs (Fintech with Deloitte, Gen AI & Business Intelligence with IBM), Integrated BBA + MBA (with EY), MBA (Core & Dual Specializations), Ph.D.

4. Unitedworld School of Law (UWSL) [Official Page: https://karnavatiuniversity.edu.in/uwsl/]:
   - 5-Year Integrated BBA LL.B. (Hons.), 5-Year Integrated BA LL.B. (Hons.), One-Year LL.M., Ph.D.

5. Unitedworld School of Liberal Arts & Mass Communication (USLMC / USLM) [Official Page: https://karnavatiuniversity.edu.in/uslm/]:
   - BA (Hons.) in Mass Communication & Journalism, BA (Hons.) in Liberal Arts, B.Sc. & M.Sc. in Psychology / Behavioural Sciences

6. Karnavati School of Dentistry (KSD) [Official Page: https://karnavatiuniversity.edu.in/ksd/]:
   - BDS (Bachelor of Dental Surgery), MDS (Master of Dental Surgery), Dental Fellowships, Ph.D. (Note: KU does NOT offer MBBS).

7. Karnavati School of Research (KSR) [Official Page: https://karnavatiuniversity.edu.in/research/]:
   - Ph.D. across multidisciplinary research domains.

=== ADMISSION QUERY HANDLING STANDARD (MANDATORY 6-POINT STRUCTURE) ===
When a student asks about the admission process, admission procedure, how to apply, or eligibility, you MUST structure your answer containing these 6 clear sections:
1. Eligibility Requirements: Specific academic qualification criteria (e.g. 10+2 with Physics & Math for UIT B.Tech; 10+2 in any stream for UID B.Des, UWSL Law, or UIM BBA; PCB for Dental BDS; recognized degree for PG).
2. Entrance Examination and Selection Process: Clarify that JEE Main or GUJCET are NOT mandatory for all programmes (they apply specifically to Engineering at UIT). List entrance paths (UID DAT, UWSL KU-LAT/CLAT, UIM KU-MAT/CAT, KSD NEET-UG/MDS).
3. Application Procedure: Online registration, form submission, fee payment, entrance/selection round, campus physical verification.
4. Required Documents: Only officially verified checklist (10th & 12th marksheets, entrance scorecards, ID proof, migration/transfer certificates, photos).
5. Official Application Link: [Karnavati University Official Admissions Portal](https://karnavatiuniversity.edu.in/admission/)
6. Official Admission Contact Information: Toll-Free: 1800 270 1206 | Board Line: +91-79-61755500 | Email: admissions@karnavatiuniversity.edu.in | UIT Desks: +91 7574811136 / +91 7574811135
`;

// Helper with timeout for API requests (35 seconds timeout to allow proper LLM generation)
const API_TIMEOUT_MS = 35000;

function withTimeout<T>(promise: Promise<T>, ms: number = API_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout of ${ms}ms exceeded`)), ms)
    ),
  ]);
}

// Fallback rule-based matching engine for Karnavati University
function generateFallbackResponse(userPrompt: string): { text: string; followUps: string[] } {
  const query = userPrompt.toLowerCase().trim();

  // 1. UNCONFIRMED / UNLISTED COURSES CHECK (e.g. MBBS, Pharmacy, Agriculture, Aeronautical, etc.)
  // Rule: State clearly that course availability cannot be confirmed; never replace with a generic overview
  const unconfirmedMedical = ['mbbs', 'bams', 'bhms', 'md medicine', 'ms surgery', 'nursing', 'pharmacy', 'b.pharm', 'd.pharm', 'm.pharm', 'veterinary'];
  const unconfirmedTech = ['aeronautical', 'aerospace', 'marine engineering', 'civil engineering', 'mechanical engineering', 'chemical engineering', 'automobile engineering degree'];
  const unconfirmedOthers = ['agriculture', 'b.sc agriculture', 'architecture', 'b.arch', 'm.arch'];

  for (const course of unconfirmedMedical) {
    if (query.includes(course)) {
      const courseName = course.toUpperCase();
      return {
        text: `### ⚠️ Course Availability Notice: ${courseName}
        
* **Availability Status:** The availability of **${courseName}** cannot be confirmed from Karnavati University's official academic records.
* **Confirmed Medical & Healthcare Offerings:** Karnavati University does **NOT** offer MBBS or general medical degrees. In healthcare, the university exclusively offers Dental Surgery programmes through the **Karnavati School of Dentistry (KSD)**:
  * **BDS** (Bachelor of Dental Surgery) – Admission via NEET-UG.
  * **MDS** (Master of Dental Surgery) – Admission via NEET-MDS.
* **Official Verification:** Please refer to the official university portal or connect with the admissions desk for verified programme directories.

🔗 **Official Source:** [Karnavati University Academic Programmes](https://karnavatiuniversity.edu.in/)  
📞 **Admissions Helpline:** 1800 270 1206 | **Email:** \`admissions@karnavatiuniversity.edu.in\``,
        followUps: [
          'What programmes are offered by Karnavati School of Dentistry (KSD)?',
          'What constituent schools exist at Karnavati University?',
          'How do I contact the Karnavati University admissions office?'
        ]
      };
    }
  }

  for (const course of unconfirmedTech) {
    if (query.includes(course)) {
      const courseName = course.charAt(0).toUpperCase() + course.slice(1);
      return {
        text: `### ⚠️ Course Availability Notice: ${courseName}

* **Availability Status:** The availability of **${courseName}** cannot be confirmed from Karnavati University's official records.
* **Confirmed Engineering Offerings (UIT):** **Unitedworld Institute of Technology (UIT)** offers B.Tech. exclusively in **Computer Science & Engineering (CSE)** with the following specialized tracks:
  * B.Tech. CSE (Core / General)
  * B.Tech. CSE with Artificial Intelligence & Machine Learning (AI & ML)
  * B.Tech. CSE with Data Science *(in association with Google Cloud)*
  * B.Tech. CSE with Cyber Security & Digital Forensics
  * B.Tech. CSE with Cloud Computing & DevOps
  * B.Tech. CSE with Full Stack Development
* UIT does not currently list branches such as ${courseName} in its confirmed degree roster.

🔗 **Official Source:** [UIT Engineering Programmes](https://karnavatiuniversity.edu.in/uit/)  
📞 **UIT Admission Helpline:** +91 7574811136 / +91 7574811135`,
        followUps: [
          'What B.Tech specializations are offered by UIT?',
          'What are the eligibility criteria for B.Tech CSE at UIT?',
          'How do I apply for B.Tech admission at UIT?'
        ]
      };
    }
  }

  for (const course of unconfirmedOthers) {
    if (query.includes(course)) {
      const courseName = course.toUpperCase();
      return {
        text: `### ⚠️ Course Availability Notice: ${courseName}

* **Availability Status:** The availability of **${courseName}** cannot be confirmed from Karnavati University's official academic records.
* **Constituent Institutes at Karnavati University:** The university operates through the following verified schools:
  * **UIT:** Technology & Computer Science Engineering
  * **UID:** Design (B.Des. Hons. & M.Des.)
  * **UIM / UWSB:** Business Administration & Management (BBA & MBA)
  * **UWSL:** Law (5-Year Integrated BBA/BA LL.B. Hons., LL.M.)
  * **USLMC:** Liberal Arts & Mass Communication (BA Hons. & Psychology)
  * **KSD:** Dentistry (BDS & MDS)
  * **KSR:** Multidisciplinary Research & Ph.D.
* Schools for ${courseName} are not listed among the university's confirmed constituent colleges.

🔗 **Official Source:** [Karnavati University Official Website](https://karnavatiuniversity.edu.in/)  
📞 **Admissions Helpline:** 1800 270 1206`,
        followUps: [
          'What programmes are offered by Karnavati University?',
          'What B.Tech specializations are offered at UIT?',
          'How do I reach the admissions helpdesk?'
        ]
      };
    }
  }

  // 2. SCHOLARSHIP & FINANCIAL ASSISTANCE QUERIES
  // Rule: Provide verified schemes, eligibility, benefits, application steps; direct unconfirmed cutoffs to scholarship desk
  if (query.includes('scholarship') || query.includes('financial aid') || query.includes('fee waiver') || query.includes('concession') || query.includes('freeship') || query.includes('stipend')) {
    return {
      text: `### 🏅 Scholarships & Financial Assistance at Karnavati University

#### 1. Verified Scholarship Schemes:
* **Karnavati University Merit Scholarship Programme:**
  * **Scheme Overview:** Merit-based tuition fee concessions awarded to qualifying undergraduate and postgraduate applicants for academic excellence.
  * **Eligibility:** High scores in qualifying board examinations (Class 12th percentage for UG; Bachelor's degree aggregate for PG) or outstanding ranks in recognized national/state entrance tests (such as JEE Main, GUJCET, DAT, CLAT).
  * **Benefits:** Partial concession / waiver on tuition fees applied across the academic year.
  * **Renewal Conditions:** Maintenance of prescribed minimum semester CGPA, regular classroom attendance, and clearing all examinations without active backlogs/ATKT.
* **Special Category Concessions:**
  * **Defense & Martyrs' Wards:** Concessional tuition support for children of armed forces personnel and defense martyrs.
  * **Sports Excellence:** Financial assistance/concessions for students with certified achievements at national or state sports tournaments.

#### 2. Application Procedure:
1. Indicate your intention to apply for the Merit Scholarship during the admission application or counselling stage.
2. Submit self-attested copies of Class 10th & 12th marksheets, competitive entrance test scorecards, and any relevant category/sports certificates.
3. Verification and formal approval is carried out by the **Central University Scholarship Committee**.

#### 3. Notice Regarding Session Cutoffs & Official Assistance:
* Specific percentage cutoff slabs and exact fee concession brackets for the current academic session are determined annually by the scholarship committee and are not published as a fixed flat rate.
* For verified session-specific eligibility slabs and application deadlines, please contact the scholarship and admissions desk directly:

🔗 **Official Source:** [Karnavati University Admissions & Scholarships](https://karnavatiuniversity.edu.in/admission/)  
📞 **Toll-Free Helpline:** 1800 270 1206 | **Board Line:** +91-79-61755500  
✉️ **Email:** \`admissions@karnavatiuniversity.edu.in\``,
      followUps: [
        'What is the admission procedure at Karnavati University?',
        'Where can I find tuition fee schedules?',
        'What B.Tech specializations are offered at UIT?'
      ]
    };
  }

  // 3. PLACEMENTS & CAREER SERVICES QUERIES
  if (query.includes('placement') || query.includes('package') || query.includes('salary') || query.includes('recruiter') || query.includes('internship') || query.includes('crc') || query.includes('career')) {
    return {
      text: `### 💼 Placements & Corporate Resource Center (CRC)

* **Career Development & Industry Interface:** Karnavati University's dedicated **Corporate Resource Center (CRC)** drives student placements, pre-placement training, industry internships, and campus recruitment drives.
* **Recruiter Network:** Organizations from IT, design studios, consulting, legal, and financial sectors participate in recruitment across UIT, UID, UIM, and UWSL cohorts.
* **Pre-Placement Training:** Includes technical workshops, resume design, coding bootcamps (for UIT engineering students), mock interviews, and industry-partnered certifications (e.g., Google Cloud, IBM, EY, Deloitte).
* **Policy on Exact Salary Packages:** In keeping with accurate reporting standards, specific individual package figures fluctuate each season across disciplines; verified sector-wise placement reports can be obtained from the placement cell.

🔗 **Official Source:** [Karnavati University Placements](https://karnavatiuniversity.edu.in/)  
✉️ **Placement Cell:** \`placements@karnavatiuniversity.edu.in\` / \`info@karnavatiuniversity.edu.in\`  
📞 **University Office:** +91-79-61755500`,
      followUps: [
        'What B.Tech specializations are offered at UIT?',
        'What merit scholarships are available at Karnavati University?',
        'How do I contact the Karnavati University admissions office?'
      ]
    };
  }

  // 4. FEES QUERIES - Strict truthfulness
  if (query.includes('fee') || query.includes('tuition') || query.includes('cost') || query.includes('charges')) {
    return {
      text: `### 💳 Tuition & Fee Information

* **Policy on Fee Schedules:** Karnavati University determines tuition and hostel fees individually for each constituent institute (UIT, UID, UIM, UWSL, KSD) and academic cohort.
* **Notice Regarding Exact Figures:** Exact current-year fee structures are not published as a static flat rate and should not be estimated.
* To receive the confirmed, verified fee structure and installment schedule for your specific programme, please contact the admissions cell directly or visit the official admissions portal.

🔗 **Official Source:** [Karnavati University Admissions](https://karnavatiuniversity.edu.in/)  
📞 **Admissions Helpline:** 1800 270 1206 / +91-79-61755500  
✉️ **Email:** \`admissions@karnavatiuniversity.edu.in\``,
      followUps: [
        'What merit scholarships are offered by Karnavati University?',
        'What B.Tech specializations are offered by UIT?',
        'How do I contact the Karnavati University admissions office?'
      ]
    };
  }

  // 5. ADMISSIONS (Specific to UIT B.Tech)
  if ((query.includes('uit') || query.includes('b.tech') || query.includes('engineering')) && (query.includes('admission') || query.includes('selection') || query.includes('apply') || query.includes('process') || query.includes('criteria'))) {
    return {
      text: `### 🎓 Admission Process for B.Tech at Unitedworld Institute of Technology (UIT)

#### 1. Eligibility Requirements:
* Candidates must have passed 10+2 (Higher Secondary) or equivalent from a recognized board (CBSE, GSEB, ICSE, or other recognized state/central boards).
* Compulsory subjects: **Physics and Mathematics**, along with one of **Chemistry / Computer Science / Information Technology / Biology**.
* Minimum aggregate percentage as prescribed by regulatory authorities.

#### 2. Entrance Examination and Selection Process:
* Admission to B.Tech. programmes at UIT considers valid scores/ranks in:
  * **JEE Main** (National Level), OR
  * **GUJCET** (State Level), OR
  * Karnavati University admission assessment / merit criteria.
* *Note: Entrance examinations like JEE Main / GUJCET apply specifically to Engineering and are not required for other non-engineering programmes at the university.*

#### 3. Application Procedure:
1. **Online Registration:** Visit the official admission portal and create an applicant profile.
2. **Form Submission:** Fill in academic credentials and upload requisite scanned certificates.
3. **Application Fee:** Pay the prescribed application fee online through the payment gateway.
4. **Counselling & Selection:** Participate in the merit allocation or counselling process.
5. **Admission Confirmation:** Complete physical document verification and seat confirmation at the Gandhinagar campus.

#### 4. Required Documents (Officially Verified Checklist):
* Class 10th Marksheet and Passing Certificate (Proof of Date of Birth).
* Class 12th Marksheet and Passing Certificate (or admit card if awaiting results).
* JEE Main / GUJCET Scorecard.
* School Leaving Certificate / Transfer Certificate (TC) / Migration Certificate.
* Government-issued Photo ID Proof (Aadhaar Card, Passport, etc.).
* Recent passport-size photographs.

#### 5. Official Application Link:
🔗 **Apply Online:** [Karnavati University Official Admissions Portal](https://karnavatiuniversity.edu.in/admission/)  
🔗 **UIT Engineering Portal:** [Unitedworld Institute of Technology (UIT)](https://karnavatiuniversity.edu.in/uit/)

#### 6. Official Admission Contact Information:
* **Toll-Free Helpline:** 1800 270 1206
* **UIT Direct Desks:** +91 7574811136 / +91 7574811135 / +91 9898203137 / +91 6358150869
* **Admissions Email:** \`admissions@karnavatiuniversity.edu.in\`
* **Campus Address:** Welcome Center, Karnavati University, A/907, Uvarsad-Vavol Road, Knowledge Village, At & Po. Uvarsad, Gandhinagar - 382422, Gujarat, India.`,
      followUps: [
        'What B.Tech specializations are offered at UIT?',
        'What are the campus hostel facilities at Gandhinagar?',
        'Where can I find tuition fee schedules?'
      ]
    };
  }

  // 6. ADMISSIONS & SELECTION PROCESS (General University Level)
  if (query.includes('admission') || query.includes('apply') || query.includes('eligibility') || query.includes('selection process') || query.includes('how to apply') || query.includes('document')) {
    return {
      text: `### 🎓 Admission Process at Karnavati University

#### 1. Eligibility Requirements:
Academic eligibility is established based on the chosen constituent institute and programme:
* **Engineering (UIT B.Tech.):** 10+2 with Physics and Mathematics (compulsory) along with Chemistry / Computer Science.
* **Design (UID B.Des. Hons.):** 10+2 in any stream (Science, Commerce, Arts, or Humanities) from a recognized board.
* **Law (UWSL BBA LL.B. / BA LL.B. Hons.):** 10+2 in any stream from a recognized board.
* **Management (UIM BBA / Integrated BBA+MBA):** 10+2 from a recognized board; MBA requires a recognized Bachelor's degree.
* **Dentistry (KSD BDS):** 10+2 with Physics, Chemistry, and Biology (PCB).
* **Liberal Arts & Mass Communication (USLMC):** 10+2 in any discipline from a recognized board.

#### 2. Entrance Examination and Selection Process:
* **Important:** Entrance examination requirements vary by discipline. **JEE Main or GUJCET are NOT mandatory for all programmes**; they apply specifically to Engineering at UIT.
* **Selection channels by constituent school:**
  * **Engineering (UIT):** Considers JEE Main, GUJCET, or university merit evaluation.
  * **Design (UID):** Design Aptitude Test (DAT) followed by Studio Test / Portfolio Review and Personal Interview.
  * **Law (UWSL):** National law entrance tests (CLAT, LSAT) or Karnavati University Law Aptitude Test (KU-LAT) + Personal Interview.
  * **Management (UIM):** UGAT / KU-MAT / national entrance tests (CAT / CMAT / MAT for MBA) + Personal Interview.
  * **Dentistry (KSD):** NEET-UG (for BDS) and NEET-MDS (for MDS) as per statutory regulatory council mandates.
  * **Liberal Arts & Media (USLMC):** Academic merit evaluation and Personal Interaction.

#### 3. Application Procedure:
1. **Online Application:** Visit the official portal at [https://karnavatiuniversity.edu.in/admission/](https://karnavatiuniversity.edu.in/admission/).
2. **Profile & Programme Selection:** Register with contact details and select the target school and course.
3. **Document Upload:** Upload scanned copies of required academic records.
4. **Application Fee Payment:** Submit the prescribed registration fee online.
5. **Selection Round:** Appear for the programme-specific entrance test, portfolio review, or interview as scheduled.
6. **Verification & Enrollment:** Complete physical document verification and seat confirmation at the Gandhinagar campus.

#### 4. Required Documents (Officially Verified Checklist):
* Class 10th Marksheet & Passing Certificate (Proof of Date of Birth).
* Class 12th Marksheet & Passing Certificate (or provisional if awaiting results).
* Graduation Marksheets & Degree Certificate (for PG / Ph.D. applicants).
* Relevant Entrance Exam Scorecard (e.g. JEE Main/GUJCET for B.Tech, DAT for UID, CLAT for Law, NEET for BDS, where applicable).
* School Leaving Certificate / Transfer Certificate (TC) / Migration Certificate.
* Government Photo ID Proof (Aadhaar Card, Voter ID, or Passport).
* Recent passport-size photographs.

#### 5. Official Application Link:
🔗 **Official Portal:** [Karnavati University Admissions Portal](https://karnavatiuniversity.edu.in/admission/)  
🔗 **Main Website:** [https://karnavatiuniversity.edu.in/](https://karnavatiuniversity.edu.in/)

#### 6. Official Admission Contact Information:
* **Toll-Free Helpline:** 1800 270 1206
* **University Board Line:** +91-79-61755500
* **UIT Direct Desks:** +91 7574811136 / +91 7574811135 / +91 9898203137 / +91 6358150869
* **Admissions Email:** \`admissions@karnavatiuniversity.edu.in\`
* **Campus Desk:** Welcome Center, Karnavati University, A/907, Uvarsad-Vavol Road, Knowledge Village, At & Po. Uvarsad, Gandhinagar - 382422, Gujarat, India.`,
      followUps: [
        'What are the eligibility requirements for B.Tech at UIT?',
        'What documents are required during physical admission verification?',
        'What entrance exams are accepted for Unitedworld School of Law (UWSL)?'
      ]
    };
  }

  // 7. UIT & B.TECH SPECIFIC
  if (query.includes('uit') || query.includes('b.tech') || query.includes('btech') || query.includes('engineering') || query.includes('computer science') || query.includes('cse')) {
    return {
      text: `### 💻 B.Tech Programmes at Unitedworld Institute of Technology (UIT)

**Unitedworld Institute of Technology (UIT)** offers a 4-year **B.Tech. in Computer Science & Engineering (CSE)** with the following industry-aligned specializations:

* **B.Tech. CSE (Core / General)**
* **B.Tech. CSE with Artificial Intelligence & Machine Learning (AI & ML)**
* **B.Tech. CSE with Data Science** *(in association with Google Cloud)*
* **B.Tech. CSE with Cyber Security & Digital Forensics**
* **B.Tech. CSE with Cloud Computing & DevOps**
* **B.Tech. CSE with Full Stack Development**

**Eligibility & Selection:**
* Candidates must have passed 10+2 with Physics and Mathematics (compulsory) along with Chemistry / Computer Science from a recognized board (CBSE, GSEB, ICSE).
* Admission considers scores from **JEE Main**, **GUJCET**, or Karnavati University admission criteria.

🔗 **Official Source:** [Unitedworld Institute of Technology (UIT)](https://karnavatiuniversity.edu.in/uit/)  
📞 **UIT Helplines:** +91 7574811136 / +91 7574811135 / +91 9898203137`,
      followUps: [
        'How do I apply for B.Tech admission at UIT?',
        'Does UIT offer B.Tech in Data Science with Google Cloud?',
        'What are the official contact numbers for UIT?'
      ]
    };
  }

  // 8. GENERAL COURSES / CONSTITUENT SCHOOLS DIRECTORY
  if (query.includes('course') || query.includes('programme') || query.includes('school') || query.includes('degrees') || query.includes('what can i study') || query.includes('academics')) {
    return {
      text: `### 📚 Programmes Offered by Karnavati University

Karnavati University offers undergraduate, postgraduate, and doctoral programmes through its constituent institutes:

* **UIT (Engineering):** B.Tech. in Computer Science & Engineering with specializations in AI & ML, Data Science (with Google Cloud), Cyber Security, Cloud Computing, and Full Stack Development.
* **UID (Design):** B.Des. (Hons.) and M.Des. across Product Design, Visual Communication, Fashion Design, Interior & Furniture, and Animation.
* **UIM / UWSB (Management):** BBA (Hons.), Specialized BBAs (Fintech with Deloitte, Gen AI with IBM), Integrated BBA+MBA with EY, and MBA.
* **UWSL (Law):** 5-Year Integrated BBA LL.B. (Hons.), 5-Year Integrated BA LL.B. (Hons.), and LL.M.
* **USLMC (Liberal Arts & Media):** BA (Hons.) in Mass Communication & Journalism, and BA (Hons.) in Liberal Arts.
* **KSD (Dentistry):** Bachelor of Dental Surgery (BDS) and Master of Dental Surgery (MDS).
* **KSR (Research):** Ph.D. programmes across multidisciplinary domains.

🔗 **Official Source:** [Karnavati University Programmes Directory](https://karnavatiuniversity.edu.in/)`,
      followUps: [
        'What B.Tech specializations are offered by UIT?',
        'What programmes are offered by Unitedworld Institute of Design (UID)?',
        'What law degrees are available at UWSL?'
      ]
    };
  }

  // 9. EXAMINATIONS & ACADEMIC POLICIES
  if (query.includes('exam') || query.includes('attendance') || query.includes('datesheet') || query.includes('schedule') || query.includes('hall ticket') || query.includes('result')) {
    return {
      text: `### 📝 Examination & Attendance Guidelines

* **Attendance Policy:** In accordance with statutory university regulations and regulatory council norms, students must satisfy the prescribed minimum attendance in theory lectures and laboratory practicals to be eligible for semester-end examinations.
* **Examination Timetables & Hall Tickets:** Datesheets, admit cards, and examination schedules are issued on a term-by-term basis by the **Office of the Controller of Examinations** and made accessible through the university student ERP portal and campus notice boards.
* **Personal Marks & Grades:** Individual grades and marksheets are confidential and accessible exclusively by logging into your official student ERP portal.

🔗 **Official Source:** [Karnavati University Website](https://karnavatiuniversity.edu.in/)`,
      followUps: [
        'Where can students access official academic notifications?',
        'What campus facilities and libraries are available in Gandhinagar?',
        'How do I contact the university administrative desk?'
      ]
    };
  }

  // 10. CAMPUS FACILITIES
  if (query.includes('facility') || query.includes('hostel') || query.includes('library') || query.includes('sports') || query.includes('mess') || query.includes('canteen') || query.includes('health') || query.includes('gym')) {
    return {
      text: `### 🏛️ Campus Facilities at Karnavati University

* **Central Library & E-Resource Centre:** Extensive collection of reference books, design archives, research journals, and digital databases.
* **Technical & Computing Labs (UIT):** Modern computer labs equipped for AI & ML, Data Science (Google Cloud), and networking.
* **Hostel Accommodation:** Separate, secure on-campus residential hostels for boys and girls with 24/7 security, Wi-Fi, and warden supervision.
* **Mess & Dining:** Hygienic cafeteria and dining mess providing multi-cuisine meals and refreshments.
* **Sports & Recreation:** Outdoor fields for cricket and football, basketball and volleyball courts, and an indoor gym.
* **Healthcare Support:** On-campus medical room with clinical support from the affiliated Karnavati School of Dentistry (KSD).

📍 **Location:** Knowledge Village, A/907, Uvarsad-Vavol Road, Gandhinagar - 382422, Gujarat.  
🔗 **Official Source:** [Karnavati University Campus](https://karnavatiuniversity.edu.in/)`,
      followUps: [
        'What B.Tech specializations are offered at UIT?',
        'What are the campus hostel rules and facilities?',
        'What are the official contact numbers of Karnavati University?'
      ]
    };
  }

  // 11. CONTACT INFORMATION
  if (query.includes('contact') || query.includes('address') || query.includes('phone') || query.includes('email') || query.includes('location') || query.includes('where') || query.includes('toll free')) {
    return {
      text: `### 📞 Karnavati University Contact Information

* **Campus Address:**  
  Karnavati University, A/907, Uvarsad-Vavol Road, Knowledge Village, At & Po. Uvarsad, Gandhinagar - 382422, Gujarat, India
* **Toll-Free Helpline:** **1800 270 1206**
* **General Board Line:** **+91-79-61755500**
* **UIT Engineering Admissions:** +91 7574811136 / +91 7574811135 / +91 9898203137
* **Official Emails:**  
  * Admissions: \`admissions@karnavatiuniversity.edu.in\`  
  * General Inquiries: \`info@karnavatiuniversity.edu.in\`

🔗 **Official Source:** [Karnavati University Official Website](https://karnavatiuniversity.edu.in/)`,
      followUps: [
        'What programmes are offered by Karnavati University?',
        'What B.Tech specializations are offered by UIT?',
        'How do I apply for admissions at Karnavati University?'
      ]
    };
  }

  // 12. Non-generic default response for unrecognized queries
  return {
    text: `### ℹ️ Karnavati University Information Assistant

I could not locate verified official university records specifically addressing your inquiry about:
> *"${userPrompt.slice(0, 80)}${userPrompt.length > 80 ? '...' : ''}"*

To ensure you receive completely verified information without inaccuracies:
* **Official Website:** Search the official directory at [karnavatiuniversity.edu.in](https://karnavatiuniversity.edu.in/).
* **Admissions & Student Helpdesk:** Call toll-free **1800 270 1206** or board line **+91-79-61755500**.
* **Direct Email:** Reach out to \`admissions@karnavatiuniversity.edu.in\` or \`info@karnavatiuniversity.edu.in\`.

You may also ask about our verified topics: **UIT B.Tech specializations**, **Admissions & Eligibility**, **Merit Scholarships**, **Campus Facilities**, or **Fee Guidelines**.`,
    followUps: [
      'What B.Tech specializations are offered by Unitedworld Institute of Technology (UIT)?',
      'What merit scholarships are offered by Karnavati University?',
      'What is the admission procedure at Karnavati University?'
    ]
  };
}

// API endpoint for college static info and directory
app.get('/api/college-info', (_req, res) => {
  res.json({
    college: COLLEGE_INFO,
    facilities: CAMPUS_FACILITIES,
    notices: RECENT_NOTICES,
    departments: COLLEGE_DEPARTMENTS,
    suggestedQuestions: SUGGESTED_QUESTIONS,
  });
});

// API endpoint for Chat with Gemini streaming or fallback
app.post('/api/chat', async (req, res) => {
  const { messages, stream = true } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const latestUserMessage = messages[messages.length - 1];
  const userText = latestUserMessage?.content || latestUserMessage?.text || '';

  // If Gemini API client is available, call the official SDK
  if (aiClient) {
    try {
      const conversationHistory = messages.map((m: any) => ({
        role: m.sender === 'bot' || m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text || m.content || '' }],
      }));

      if (stream) {
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }

        const chat = aiClient.chats.create({
          model: 'gemini-3.8-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
          history: conversationHistory.slice(0, -1),
        });

        const streamResponse = await withTimeout(
          chat.sendMessageStream({
            message: userText,
          }),
          API_TIMEOUT_MS
        );

        let accumulatedText = '';
        for await (const chunk of streamResponse) {
          const chunkText = chunk.text || '';
          if (chunkText) {
            accumulatedText += chunkText;
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        }

        // Generate tailored follow-ups based on the user prompt
        const fallback = generateFallbackResponse(userText);
        res.write(`data: ${JSON.stringify({ done: true, followUps: fallback.followUps })}\n\n`);
        return res.end();
      } else {
        const chat = aiClient.chats.create({
          model: 'gemini-3.8-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
          history: conversationHistory.slice(0, -1),
        });

        const response = await withTimeout(
          chat.sendMessage({
            message: userText,
          }),
          API_TIMEOUT_MS
        );

        const fallback = generateFallbackResponse(userText);
        return res.json({
          text: response.text || 'I could not formulate a response. Please visit https://karnavatiuniversity.edu.in/.',
          model: 'gemini-3.8-flash',
          followUps: fallback.followUps,
        });
      }
    } catch (error: any) {
      console.error('Gemini API Error, falling back to Karnavati University knowledge base:', error?.message || error);
      const fallback = generateFallbackResponse(userText);
      if (stream) {
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }
        res.write(`data: ${JSON.stringify({ text: fallback.text, followUps: fallback.followUps })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        return res.end();
      } else {
        return res.json({
          text: fallback.text,
          followUps: fallback.followUps,
          notice: 'Response generated from verified Karnavati University repository.',
        });
      }
    }
  }

  // Fallback when no Gemini API key is configured
  const fallback = generateFallbackResponse(userText);
  if (stream) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }
    res.write(`data: ${JSON.stringify({ text: fallback.text, followUps: fallback.followUps })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  }

  return res.json({
    text: fallback.text,
    followUps: fallback.followUps,
    notice: 'Karnavati University verified student knowledge base',
  });
});

// Setup Vite development server middleware in dev mode, or serve static build in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Karnavati University CampusBot server running on http://localhost:${PORT} in ${isProduction ? 'production' : 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
