**RESUME BUILDER APP**

Complete Project Document

*For use in new sessions — contains full context, decisions, code, and continuation plan*

Version 1.0  •  May 2026

Based on: Raghavendra Patki contract and full-time baseline resumes

**1. WHAT WE WANTED**

**1.1 The Product Idea**

Build a web application that takes a user's existing resume (uploaded as a file), asks for a job description, and automatically generates a tailored, ATS-optimised resume and cover letter. The app should produce output that matches the quality and structure of professionally written baseline resumes.

Key requirements from the outset:

- User uploads their own resume — no manual data entry of personal details, work history, or skills

- The AI extracts all information from the uploaded resume automatically

- User only types one thing: the job description they are applying to

- User chooses the type of output: Contract resume or Full-time resume

- Both a tailored resume AND a cover letter are generated together

- Generated resumes must not be recognisable as AI-generated

- Generated resumes must structurally match the baseline resumes (same section names, same formatting conventions, same bullet densities)

- The app is built as a React artifact using the Anthropic API directly

**1.2 Two Resume Types — What Each Means**

**Contract Resume**

Designed for W2, C2C, and 1099 contract and consulting opportunities. Key characteristics:

- Longer format — no page limit

- Bold standalone availability line in the header: W2 / C2C / 1099 • Remote / Hybrid / Onsite • US Work Authorized

- CONTRACT PROFILE section with 14 bullet points covering experience, tech stack, metrics, leadership, and engagement flexibility

- CORE TECHNICAL COMPETENCIES section with exactly 13 skill categories

- PROFESSIONAL EXPERIENCE with 12-14 bullets per role

- Each role has: italic project name line + one plain text descriptor sentence

**Full-Time Resume**

Designed for Staff Engineer, Principal Engineer, or Technical Lead permanent positions. Key characteristics:

- Strict one-page format

- SUMMARY section: single paragraph, exactly 3 sentences, no bullets

- TECHNICAL SKILLS section with exactly 6 skill category rows

- EXPERIENCE section with tight bullet density: 4 bullets for most recent role, 4 for second role, 3 for earlier roles

- Education section ends with: [Cert] • US Work Authorized — No Sponsorship Required

**1.3 Anti-AI-Detection Requirements**

The employer specifically required that generated resumes must not be caught as AI-generated. This means:

- Vary sentence structure — never uniform bullet format

- Mix short punchy bullets with longer contextual ones

- Sometimes lead with the outcome, sometimes with the technology, sometimes with the team context

- Metrics should feel earned, not stuffed

- Banned words: Successfully, Leveraged, Utilized, Spearheaded, Championed, Demonstrated, Ensured, Facilitated

- Preferred verbs: Built, Designed, Led, Cut, Reduced, Delivered, Shipped, Established, Introduced, Drove, Defined, Architected

- Cover letter: contractions allowed, no corporate openers, no 'I am writing to express my interest'

**2. THE BASELINE RESUMES**

**2.1 What the Baselines Are**

The entire app is built to match two baseline resumes created for Raghavendra Patki. These are the gold standard that every generated resume must match structurally. They were developed through multiple review and editing cycles.

| **Files: **Raghavendra_Patki_Contract_FIXED.docx  │  Raghavendra_Patki_FullTime_FIXED.docx |
| --- |

**2.2 Contract Resume — Exact Structure**

| **Header line 1** | FULL NAME — bold, large |
| --- | --- |
| **Header line 2** | Senior Full Stack Technical Lead  │  Contract & Consulting |
| **Header line 3** | Location  •  Phone  •  Email  •  LinkedIn URL |
| **Header line 4** | Availability: Immediate  •  W2 / C2C / 1099  •  Remote / Hybrid / Onsite  •  US Work Authorized  (bold, standalone) |
| **Section 1** | CONTRACT PROFILE — 14 bullet points |
| **Section 2** | CORE TECHNICAL COMPETENCIES — 13 plain text rows |
| **Section 3** | PROFESSIONAL EXPERIENCE — roles with 12-14 bullets each |
| **Section 4** | EDUCATION & CERTIFICATIONS |

**2.3 Contract Resume — Exact Skill Categories (13 rows in this order)**

| **1** | Languages |
| --- | --- |
| **2** | Backend |
| **3** | Frontend |
| **4** | AWS Cloud |
| **5** | Containers |
| **6** | Messaging |
| **7** | AI/ML Integration |
| **8** | Security |
| **9** | CI/CD & DevOps |
| **10** | Testing |
| **11** | Observability |
| **12** | Data |
| **13** | Methodologies |

**2.4 Contract Resume — Role Format**

Each role follows this exact format:

| **[Job Title]**  │  **[Company]**  [Dates right-aligned] *Project: [Project Name — Platform Description]* [One sentence plain text describing the platform/system.] - Bullet 1 - Bullet 2 ... (12-14 bullets total) |
| --- |

**2.5 Full-Time Resume — Exact Structure**

| **Header line 1** | FULL NAME — bold, large |
| --- | --- |
| **Header line 2** | Title matching job description |
| **Header line 3** | Location  •  Phone  •  Email  •  LinkedIn URL |
| **Section 1** | SUMMARY — single paragraph, 3 sentences, NO bullets |
| **Section 2** | TECHNICAL SKILLS — 6 plain text rows |
| **Section 3** | EXPERIENCE — tight bullet density |
| **Section 4** | EDUCATION & CERTIFICATIONS |

**2.6 Full-Time Resume — Exact Skill Categories (6 rows in this order)**

| **1** | Backend |
| --- | --- |
| **2** | Frontend |
| **3** | Cloud & Infra |
| **4** | Messaging & ML |
| **5** | Security & CI/CD |
| **6** | Testing |

**2.7 Full-Time Resume — Bullet Density (one-page constraint)**

| **Most recent role** | Exactly 4 bullets |
| --- | --- |
| **Second role** | Exactly 4 bullets |
| **Earlier roles** | Exactly 3 bullets each |
| **Education last line** | [Cert]  •  US Work Authorized — No Sponsorship Required |

**2.8 Summary Format — Full-Time Resume**

The summary is a single paragraph — NO bullets, NO hyphens, plain prose. Exactly 3 sentences:

- Sentence 1: 'Senior [title] targeting [level] roles.'

- Sentence 2: Most differentiated tech combination and employer/scale name

- Sentence 3: 2-3 concrete metrics separated by commas

Example from baseline:

| ** **Senior technical lead targeting Staff Engineer or Principal Engineer roles. 10+ years building ML-integrated enterprise platforms, Kafka event pipelines, and cloud-native microservices at Verizon scale. Architect, mentor, and delivery lead — 99.9% SLA sustained over 3 years, 35% incident automation improvement, 2 engineers promoted to mid-level. |
| --- |

**3. WHAT WE BUILT**

**3.1 App Overview**

A React single-file artifact (JSX) that calls the Anthropic API directly from the browser. No backend server required. The app runs entirely in the Claude artifact rendering environment.

- **File: **resume_builder_app.jsx — single React component

- **API: **Anthropic /v1/messages endpoint — claude-sonnet-4-20250514

- **Auth: **API key handled by the artifact environment — not passed in code

- **Calls: **3 parallel API calls: parse resume, generate resume, generate cover letter

**3.2 User Flow — 4 Steps**

| **Step 1** | Upload resume — PDF or TXT file drag/drop or click to upload |
| --- | --- |
| **Step 2** | Choose type — Contract Resume or Full-time Resume (with description of each) |
| **Step 3** | Paste job description — only thing the user manually types |
| **Step 4** | Results — Resume and Cover Letter tabs, copy button for each |

**3.3 Step 1 — Resume Parsing**

When the user uploads a file, the app sends it to the API with the PARSE_SYSTEM prompt. PDF files are sent as base64 documents. TXT/MD files are read as plain text. The API returns a JSON object with all extracted fields.

Parsed JSON schema:

| {   "name": "",   "title": "",   "location": "",   "phone": "",   "email": "",   "linkedin": "",   "summary": "",   "skills": "",   "education": "",   "certifications": "",   "roles": [     {       "company": "",       "title": "",       "dates": "",       "project": "",       "bullets": []     }   ] } |
| --- |

After parsing, the app shows a confirmation panel with: name, email, number of roles found, skills extracted, education, certifications. The user then clicks Continue.

**3.4 Step 2 — Resume Type Selection**

Two large tab buttons — Contract Resume and Full-time Resume. Each shows a description when selected explaining what that format produces. Both types include a cover letter generated at the same time.

**3.5 Step 3 — Job Description Input**

A large textarea for the full job description. The Generate button is disabled until at least 50 characters are entered. When clicked, two API calls fire simultaneously:

- Resume generation — CONTRACT_RESUME_SYSTEM or FULLTIME_RESUME_SYSTEM depending on type selected

- Cover letter generation — COVER_LETTER_SYSTEM

A loading panel shows while generating with descriptive progress messages.

**3.6 Step 4 — Results Display**

Two tabs: Resume and Cover Letter. Each tab has a Copy button. Additional buttons: Different JD (reuses parsed resume, goes back to step 3), New Resume (full reset to step 1).

The resume renders as formatted HTML with proper heading hierarchy, bullet styles, and typography. The cover letter renders as flowing paragraphs.

**4. THE FOUR AI PROMPTS**

**4.1 PARSE_SYSTEM — Resume Parser**

Used in Step 1 to extract all information from the uploaded resume. Returns ONLY valid JSON — no markdown, no backticks.

| You are a resume parser. Extract every piece of information from the resume exactly as written. Return ONLY a valid JSON object — no markdown, no backticks, no explanation: {   "name": "", "title": "", "location": "", "phone": "", "email": "",   "linkedin": "", "summary": "", "skills": "", "education": "",   "certifications": "",   "roles": [{ "company": "", "title": "", "dates": "", "project": "", "bullets": [] }] } Extract every bullet from every role verbatim. Return ONLY the JSON. |
| --- |

**4.2 CONTRACT_RESUME_SYSTEM — Contract Resume Generator**

Enforces exact structural match to the baseline contract resume. Key rules encoded:

- Exact section headings: CONTRACT PROFILE, CORE TECHNICAL COMPETENCIES, PROFESSIONAL EXPERIENCE, EDUCATION & CERTIFICATIONS

- Bold standalone availability line in header

- 14 profile bullets in a specific topic order

- Exactly 13 skill categories in exact name order

- 12-14 bullets per role with project name line + descriptor sentence

- Anti-AI-detection writing style rules

Full prompt:

| You are a senior technical recruiter and resume writer specialising in contract placements. You write resumes that sound exactly like a human wrote them — direct, confident, specific, and varied in sentence structure. Never templated, never formulaic, never AI-sounding. Use ONLY information already present in the candidate's resume. Never invent technologies, companies, metrics, or achievements. OUTPUT FORMAT — follow this structure exactly: # [FULL NAME] [Title] │ Contract & Consulting [Location] • [Phone] • [Email] • [LinkedIn] **Availability: Immediate • W2 / C2C / 1099 • Remote / Hybrid / Onsite • US Work Authorized** ## CONTRACT PROFILE (14 bullet points) ## CORE TECHNICAL COMPETENCIES (plain text rows) ## PROFESSIONAL EXPERIENCE **[Job Title]** │ **[Company]** │ [Dates] *Project: [Project Name — Platform Description]* [One sentence plain text describing the system/platform.] - bullet (12-14 per role) ## EDUCATION & CERTIFICATIONS CONTRACT PROFILE — 14 bullets in this order: 1. Years of experience and domain breadth 2. Core tech stack — use exact JD keywords 3. Most impressive delivery metric 4. ML/AI integration depth 5. Cloud infrastructure ownership 6. Event streaming / messaging depth 7. API security architecture 8. Observability with metric 9. IaC and deployment automation 10. API platform / cross-team leadership 11. People leadership — team size, outcomes 12. Process improvement with metric 13. Engagement flexibility — specific, not generic 14. Cross-team or client-facing delivery — specific CORE TECHNICAL COMPETENCIES — exact 13 categories in order: Languages │ Backend │ Frontend │ AWS Cloud │ Containers │ Messaging │ AI/ML Integration │ Security │ CI/CD & DevOps │ Testing │ Observability │ Data │ Methodologies EXPERIENCE — 12-14 bullets per role: - Architecture/delivery first, then tech depth, then outcomes, then leadership - Never start two consecutive bullets with the same verb - Mix short punchy and longer contextual bullets - Vary openings: outcome first / technology first / team context first - Avoid: Successfully, Leveraged, Utilized, Spearheaded, Championed - Use: Built, Designed, Led, Cut, Reduced, Delivered, Shipped, Established |
| --- |

**4.3 FULLTIME_RESUME_SYSTEM — Full-Time Resume Generator**

Enforces exact structural match to the baseline full-time resume. Key rules encoded:

- Exact section headings: SUMMARY, TECHNICAL SKILLS, EXPERIENCE, EDUCATION & CERTIFICATIONS

- Summary: 3 sentences, no bullets, plain paragraph

- Exactly 6 skill categories in exact name order

- Strict bullet density: 4 / 4 / 3 for one-page constraint

- Education ends with work auth line

- Anti-AI-detection writing style rules

Full prompt:

| You are a senior technical recruiter and resume writer specialising in full-time Staff and Principal Engineer placements. You write resumes that sound exactly like a human wrote them. Never AI-sounding. Use ONLY information already in the candidate's resume. OUTPUT FORMAT: # [FULL NAME] [Title matching JD] [Location] • [Phone] • [Email] • [LinkedIn] ## SUMMARY [Single paragraph, 3 sentences, NO bullet points.  S1: target level/role. S2: differentiated tech + company. S3: 2-3 metrics.] ## TECHNICAL SKILLS (plain text rows) ## EXPERIENCE **[Job Title]** │ **[Company]** │ [Dates] *[Project/Platform Name]* - bullet (exactly 4 for most recent) **[Job Title]** │ **[Company]** │ [Dates] *[Project/Platform Name]* - bullet (exactly 4 for second role) **[Job Title]** │ **[Company]** │ [Dates] *[Project/Platform Name]* - bullet (exactly 3 for earlier roles) ## EDUCATION & CERTIFICATIONS [Degree] — [University], [Year] [Certifications] • US Work Authorized — No Sponsorship Required TECHNICAL SKILLS — exact 6 categories in order: Backend │ Frontend │ Cloud & Infra │ Messaging & ML │ Security & CI/CD │ Testing BULLET DENSITY — strict one-page: - Most recent role: exactly 4 bullets - Second role: exactly 4 bullets - Earlier roles: exactly 3 bullets each WRITING RULES: - Vary structure: sometimes metric first, sometimes action first - Short punchy bullets often beat long compound ones - No soft claims, no filler adjectives - Avoid: Successfully, Leveraged, Utilized, Spearheaded, Championed |
| --- |

**4.4 COVER_LETTER_SYSTEM — Cover Letter Generator**

Generates a 3-4 paragraph cover letter under 300 words. Runs in parallel with the resume generation call.

| You are an expert cover letter writer. You write cover letters that sound genuinely human — warm, direct, and specific. Never sound like AI. No "I am writing to express my interest." No hollow enthusiasm. STRUCTURE: - Opening: One confident sentence. Reference something specific from the JD. - Para 1 (3-4 sentences): Most relevant achievements matching JD priorities.   Be specific — name the metric, technology, outcome. - Para 2 (3-4 sentences): Second relevant thread — leadership, range, or   complementary technical area. - Closing (2-3 sentences): Genuine interest + clear next step.   No "I look forward to hearing from you at your earliest convenience." TONE: - Confident but not arrogant - First person, contractions fine (I've, I'm, I'd) - No exclamation marks, no corporate jargon - Like a senior engineer wrote this on a Sunday evening LENGTH: 3-4 short paragraphs. Under 300 words. Start with "Dear Hiring Manager," or personalise if company is identifiable. |
| --- |

**5. TECHNICAL IMPLEMENTATION**

**5.1 API Call Pattern — Resume Parse**

| // PDF files const b64 = await new Promise((res, rej) => {   const r = new FileReader();   r.onload = () => res(r.result.split(",")[1]);   r.onerror = rej;   r.readAsDataURL(file); }); messageContent = [   { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },   { type: "text", text: "Extract all information from this resume and return as JSON only." } ]; // TXT files const text = await new Promise((res) => {   const r = new FileReader(); r.onload = () => res(r.result); r.readAsText(file); }); messageContent = [{ type: "text", text: `Extract all info from this resume as JSON: ${text}` }]; // API call const resp = await fetch("https://api.anthropic.com/v1/messages", {   method: "POST",   headers: { "Content-Type": "application/json" },   body: JSON.stringify({     model: "claude-sonnet-4-20250514",     max_tokens: 3000,     system: PARSE_SYSTEM,     messages: [{ role: "user", content: messageContent }]   }) }); const d = await resp.json(); const parsed = JSON.parse(d.content[0].text.replace(/```json│```/g, "").trim()); |
| --- |

**5.2 API Call Pattern — Resume + Cover Letter (Parallel)**

| const [resumeResp, coverResp] = await Promise.all([   fetch("https://api.anthropic.com/v1/messages", {     method: "POST",     headers: { "Content-Type": "application/json" },     body: JSON.stringify({       model: "claude-sonnet-4-20250514",       max_tokens: 4000,       system: resumeType === "contract" ? CONTRACT_RESUME_SYSTEM : FULLTIME_RESUME_SYSTEM,       messages: [{         role: "user",         content: `CANDIDATE RESUME DATA: ${JSON.stringify(parsedData, null, 2)} TARGET JOB DESCRIPTION: ${jd} Rewrite this candidate's resume tailored to the JD. Use ONLY their existing info.`       }]     })   }),   fetch("https://api.anthropic.com/v1/messages", {     method: "POST",     headers: { "Content-Type": "application/json" },     body: JSON.stringify({       model: "claude-sonnet-4-20250514",       max_tokens: 1000,       system: COVER_LETTER_SYSTEM,       messages: [{         role: "user",         content: `CANDIDATE: ${JSON.stringify(parsedData, null, 2)} JD: ${jd} Write a tailored cover letter under 300 words.`       }]     })   }) ]); const resumeText = (await resumeResp.json()).content[0].text; const coverText = (await coverResp.json()).content[0].text; |
| --- |

**5.3 Component Structure**

| **App** | Main component — holds all state, orchestrates all steps |
| --- | --- |
| **StepBar** | 4-step progress indicator with completed/active/pending states |
| **TabBtn** | Contract / Full-time selection buttons (large, icon + label) |
| **RenderDoc** | Markdown-to-JSX renderer for resume display — handles headings, bullets, bold labels, italic project lines |
| **CoverLetterView** | Plain paragraph renderer for cover letter |
| **CopyBtn** | Copy to clipboard with 2-second confirmation state |
| **Btn** | Reusable button — primary (accent) and secondary (bordered) variants |

**5.4 State Variables**

| **step** | 0-3 — controls which screen is shown |
| --- | --- |
| **fileName** | Uploaded file name for display |
| **parsedData** | JSON object from resume parsing API call |
| **parsing** | Boolean — shows loading state during parse |
| **parseError** | Error message string from failed parse |
| **resumeType** | 'contract' │ 'fulltime' │ null |
| **jd** | Job description text from textarea |
| **generating** | Boolean — shows loading state during generation |
| **resume** | Generated resume markdown string |
| **coverLetter** | Generated cover letter string |
| **genError** | Error message from failed generation |
| **activeTab** | 'resume' │ 'cover' — controls results tab display |

**6. RESUME WRITING RULES (from review sessions)**

**6.1 Rules Learned from Reviewing the Baseline Resumes**

These rules were developed through multiple rounds of expert review and should inform all future prompt improvements:

**ATS Safety**

- Skills must be plain text rows (bold label: content) — NEVER tables

- Tables get dropped by Taleo, Workday, and Greenhouse parsers

- Section headings must use exact names — ATS keyword matching depends on this

**Content Quality**

- Every bullet must have a metric OR a differentiating architectural decision

- Metrics should feel earned: 'cut integration time from three weeks to four days' not 'reduced by X%'

- Angular 19 or similar — only list a technology if it appears in a bullet; otherwise claim only the range (e.g. Angular 2-19)

- Never list Java 17 for roles that ended before Java 17 was released (2021)

- No soft claims: team player, fast learner, passionate, proven, strong communicator

**Profile / Summary**

- Contract: 14 bullets covering experience, tech, metrics, leadership, and engagement

- Full-time: 3 sentences, plain paragraph, no bullets, closes on hard metrics

- Target role/level must be stated explicitly — recruiter should not have to guess

**Skills Section**

- Contract: 13 categories, exact names, exact order

- Full-time: 6 categories, exact names, exact order

- TypeScript should NOT appear in both Languages and Frontend rows

- GraphQL should only be listed if you can defend it in an interview

**Experience Bullets**

- Contract: 12-14 bullets per role — architecture first, tech depth, outcomes, leadership last

- Full-time: strict 4/4/3 density for one-page constraint

- Never start two consecutive bullets with the same verb

- Newwave / early roles: frame around complexity, not headcount ('500+ users' is weak)

- '85%+ test coverage' reads as junior — replace with something more senior

- 'Gained foundational experience' reads as junior — always remove

**Education**

- Contract: Oracle cert on its own line under the two degrees

- Full-time: [Cert] • US Work Authorized — No Sponsorship Required on same line

**What Cannot Be Fixed by Editing**

- AWS certifications — no cert but claims 5+ years of ECS/EKS/RDS ownership is a gap

- No GitHub link — Staff/Principal roles increasingly expect public code

- LinkedIn must mirror the resume exactly — recruiters cross-check

**7. WHAT STILL NEEDS TO BE DONE**

**7.1 Known Issues**

| **Issue 1: **The app generates markdown output. It does not produce a .docx file. Users must copy the text and paste it into a Word document manually. There is no automated Word document generation. |
| --- |

| **Issue 2: **No PDF export. Users cannot download the resume as a ready-to-send PDF directly from the app. |
| --- |

| **Issue 3: **The RenderDoc component renders markdown as HTML in the browser. The formatting looks good visually but does not perfectly match the docx styling (navy headings, blue rule lines, tab-aligned dates) of the baseline resumes. |
| --- |

| **Issue 4: **DOCX file support for upload — the app currently only supports PDF and TXT. DOCX upload requires additional parsing since FileReader cannot read DOCX as plain text. |
| --- |

**7.2 Next Session — Priority Todo List**

- PRIORITY 1: Add .docx export using the docx npm library — generate a properly formatted Word document matching the baseline styling (navy headers, blue rule lines, tab-aligned dates, bullet numbering config)

- PRIORITY 2: Add PDF export — either via docx→PDF conversion or via browser print/save as PDF

- PRIORITY 3: Add DOCX upload support — use mammoth.js (available in artifact environment) to extract text from .docx files: import * as mammoth from 'mammoth'

- PRIORITY 4: Test with real job descriptions and compare output against baseline resumes section by section

- PRIORITY 5: Add a 'regenerate' option at the results step that lets users tweak the JD before regenerating without re-uploading

- PRIORITY 6: Consider adding a 'highlight keywords matched' feature that shows which JD keywords appear in the generated resume

**7.3 How to Add DOCX Export in Next Session**

The docx npm library is available in the artifact environment. The contract and full-time resume docx generation scripts already exist from the baseline resume creation session. The pattern is:

| // In the artifact, use mammoth for parsing DOCX uploads: import * as mammoth from 'mammoth'; // mammoth.extractRawValue(arrayBuffer) returns the text // For DOCX export, the generation scripts from the baseline session // (contract_resume.js and fulltime_resume.js) contain the complete // docx-js implementation with: // - Navy/accent color scheme // - Proper bullet numbering config // - Tab-aligned dates using TabStopType.RIGHT at 9360 // - Section rule lines using border bottom on paragraphs // - Plain text skill rows (bold label: value) // These scripts should be ported into the artifact as a download function. |
| --- |

**8. FILE INVENTORY**

**8.1 Deliverables Produced This Session**

| **resume_builder_app.jsx** | The complete React app — single file, ready to use as a Claude artifact |
| --- | --- |
| **Raghavendra_Patki_Contract_FIXED.docx** | Baseline contract resume — gold standard for contract output structure |
| **Raghavendra_Patki_FullTime_FIXED.docx** | Baseline full-time resume — gold standard for full-time output structure |
| **Resume_Builder_App_Project_Document.docx** | This document — complete context for next session |

**8.2 Scripts Used to Build Baseline Resumes**

Two Node.js scripts were written to generate the baseline docx files using the docx npm library. These live in the Claude container session and can be referenced to build the docx export feature:

- **contract_resume.js: **Generates Raghavendra_Patki_Contract_FIXED.docx — full contract format with all sections

- **fulltime_resume.js: **Generates Raghavendra_Patki_FullTime_FIXED.docx — one-page full-time format

Both scripts use the same color scheme: NAVY = #1F3864, ACCENT = #2B5EA7, and the same docx-js configuration for bullets, tab stops, and plain text skill rows.

**9. QUICK REFERENCE FOR NEXT SESSION**

**9.1 How to Start the Next Session**

- Upload resume_builder_app.jsx and this document to the new session

- Upload Raghavendra_Patki_Contract_FIXED.docx and Raghavendra_Patki_FullTime_FIXED.docx as baseline references

- Tell Claude: 'This is a resume builder app. Here is the project document with full context. We need to add DOCX export. The baseline resumes are the gold standard for formatting.'

**9.2 Key Design Decisions — Do Not Change**

| **FIXED: **Skills sections must ALWAYS be plain text rows — never tables. This is the single most important ATS safety decision. |
| --- |

| **FIXED: **Contract resume uses exactly these section headings: CONTRACT PROFILE │ CORE TECHNICAL COMPETENCIES │ PROFESSIONAL EXPERIENCE │ EDUCATION & CERTIFICATIONS |
| --- |

| **FIXED: **Full-time resume uses exactly these section headings: SUMMARY │ TECHNICAL SKILLS │ EXPERIENCE │ EDUCATION & CERTIFICATIONS |
| --- |

| **FIXED: **Full-time summary is a plain paragraph — 3 sentences — NO bullets. This was a deliberate design choice confirmed through multiple review rounds. |
| --- |

| **FIXED: **Full-time bullet density: 4 / 4 / 3 per role. This is what fits one page. Do not increase. |
| --- |

**9.3 Model and API Details**

| **Model** | claude-sonnet-4-20250514 |
| --- | --- |
| **Parse max_tokens** | 3000 |
| **Resume max_tokens** | 4000 |
| **Cover letter max_tokens** | 1000 |
| **API endpoint** | https://api.anthropic.com/v1/messages |
| **Auth** | Handled by artifact environment — no key in code |
| **PDF upload** | base64 encoded, sent as document type |
| **TXT upload** | FileReader.readAsText, sent as text content |

**9.4 Color Scheme (for DOCX export)**

| **NAVY** | #1F3864 — headings, name, section titles |
| --- | --- |
| **ACCENT** | #2B5EA7 — rule lines, bullet points, hyperlinks |
| **DARK** | #1A1A1A — body text |
| **MID** | #445566 — secondary text, dates, subtitles |
| **LIGHT_BG** | #F0F4F8 — skills row alternating background |

*End of document*