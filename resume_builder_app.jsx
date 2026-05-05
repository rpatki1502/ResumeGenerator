import { useState, useRef } from "react";

const NAVY = "#1a2e4a";
const ACCENT = "#2563eb";
const LIGHT = "#f0f4fa";

// --- SYSTEM PROMPTS -----------------------------------------------------------

const PARSE_SYSTEM = `You are a resume data extractor. The user will send you the full text of a resume. Read it carefully and return ALL the information from it as a JSON object.

RULES:
- Your ENTIRE response must be one valid JSON object. Start with { and end with }. No markdown, no backticks, no explanation, no preamble, nothing after the closing brace.
- Fill every field with ACTUAL content from the resume for identity and employment/education facts. Do NOT return placeholder text if the data is present in the resume.
- For roles[].bullets: do NOT paste full resume marketing bullets. Instead provide 3-8 short factual anchor phrases per role (each under ~120 characters): domains, systems, tech names as they literally appear so later steps know where the candidate worked — not resume-ready bullet copy.
- The skills field should be a brief comma-separated factual list of technologies named on the resume (for reference only downstream; generators will rebuild skills from job descriptions).

Return this exact structure, populated with real data from the resume:
{
  "name": "candidate full name",
  "title": "their professional title",
  "location": "city, state",
  "phone": "phone number",
  "email": "email address",
  "linkedin": "linkedin URL",
  "summary": "their summary text",
  "skills": "full skills section text",
  "education": "all degrees and years",
  "certifications": "all certifications",
  "roles": [
    {
      "company": "company name",
      "title": "job title",
      "dates": "date range",
      "project": "project or platform name",
      "bullets": ["short factual anchor phrase", "..."]
    }
  ]
}`;

const CONTRACT_RESUME_SYSTEM = `You are a senior technical recruiter and resume writer specialising in contract placements. You write resumes that sound exactly like a human wrote them -- direct, confident, specific, and varied in sentence structure. Never templated, never formulaic, never AI-sounding.

Primary rule: This resume is written FOR the job description. The skills section, contract profile bullets, and all professional-experience bullets are composed fresh to match the JD — not copied from the uploaded resume wording. Assume hands-on familiarity with everything the JD lists as required or strongly preferred for this application. Use uploaded data ONLY as factual anchors: name, contact, employer names, dates, education, certifications, and high-level domain/project names; keep timelines and employers truthful.

BOLDING RULE (CRITICAL):
- Whenever you mention a technology/tool/framework/platform that comes from the JD requirement extraction (or the inferred cloud provider ecosystem), wrap the term in markdown bold like **Java 8**, **Spring Boot**, **Oracle**, **Angular 8**, **Kafka**.
- Apply this in CONTRACT PROFILE bullets and all PROFESSIONAL EXPERIENCE bullets.
- Do not bold generic words (team, system, service). Only bold concrete technical terms.

===========================================
OUTPUT FORMAT -- FOLLOW EXACTLY
===========================================

# [FULL NAME]
[Job Title from their resume] | Contract & Consulting
[Location] - [Phone] - [Email] - [LinkedIn URL]

## CONTRACT PROFILE
- [14 bullet points -- see PROFILE RULES below]

## TECHNICAL SKILLS
**Languages:** [values]
**Backend:** [values]
**Frontend:** [values]
**Cloud:** [values]
**Containers:** [values]
**Messaging:** [values]
**AI/ML Integration:** [values]
**Security:** [values]
**CI/CD & DevOps:** [values]
**Testing:** [values]
**Observability:** [values]
**Data:** [values]
**Methodologies:** [values]

## PROFESSIONAL EXPERIENCE

**[Job Title]** | **[Company]** | [Dates]
*Project: [Project Name -- Platform Description]*
[One sentence plain text describing the system/platform at a high level.]
- [bullet 1]
- [bullet 2]
[12-14 bullets per role total]

## EDUCATION & CERTIFICATIONS
[Degree] -- [University], [Year]
[Degree] -- [University], [Year]
[Certifications]

===========================================
CONTRACT PROFILE RULES -- EXACTLY 14 BULLETS
===========================================
Topic order adapts to the JD: start with experience breadth + years, then front-load bullets that mirror must-have JD themes (stack, integrations, practices). Include cloud, delivery pipeline, or platform-reliability themes when the role is production software, even if the JD only names a few tools. Remaining bullets cover leadership, delivery quality, agile/reviews/mentoring, and location/engagement if the JD mentions them. If the JD is very short, still dedicate 2-3 profile bullets to related production skills (cloud, deployment, monitoring) per SPARSE JD rules.

===========================================
SKILLS SECTION RULES
===========================================
Use EXACTLY these 13 category names in EXACTLY this order:
Languages | Backend | Frontend | Cloud | Containers | Messaging | AI/ML Integration | Security | CI/CD & DevOps | Testing | Observability | Data | Methodologies

CRITICAL: Format as plain text rows -- bold label then colon then values. NEVER as a table.
Populate categories from the JD first — map JD language into these buckets. Avoid duplicating the same skill across multiple categories unless needed for clarity.
Every skill line should be reinforced by at least one experience bullet in this document.
Never output "N/A" in skills.

===========================================
SPARSE JD / RELATED SKILLS (ALWAYS APPLY)
===========================================
If the job description lists few concrete technologies, or omits whole areas (e.g. cloud, containers, observability), you MUST still enrich the resume with standard adjacent skills that credible candidates in this role class almost always use.
- Infer role archetype from title, industry, and JD responsibilities (e.g. enterprise full stack, backend services, data platforms).
- Add related skills and matching experience bullets for: major cloud provider services (managed compute, storage, networking, identity/IAM, managed databases, monitoring/alerting), containerization and orchestration where production systems are implied, CI/CD and environment promotion, logging/metrics/tracing at a high level, security patterns for APIs and data.
- Do not leave cloud/containers/observability entirely absent for senior production-software roles unless the JD is clearly non-cloud (e.g. purely embedded, on-prem legacy with no cloud context).
- Prefer phrasing that stays consistent with the JD stack (e.g. Java/Spring roles get cloud services commonly paired with that stack).

===========================================
EXPERIENCE RULES -- 12-14 BULLETS PER ROLE
===========================================
Write NEW bullets for each role targeting the JD stack and responsibilities — do not recycle wording from uploaded resume bullets. Tie accomplishments to real employers/dates/domains from the factual anchors only.
Structure: architecture/delivery first -> technology depth -> outcomes -> leadership last
- Never start two consecutive bullets with the same verb
- Mix short punchy bullets (1 line) with longer contextual ones (2 lines)
- Vary openings: sometimes outcome first, sometimes technology first, sometimes team context
- Metrics must feel earned: "cut integration time from three weeks to four days" not "reduced by 55%"
- Every bullet needs either a metric OR a specific architectural decision -- never both vague
- Lead with the most impressive/relevant points for the JD near the top of each role

BANNED WORDS: Successfully, Leveraged, Utilized, Spearheaded, Championed, Demonstrated, Ensured, Facilitated, Passionate, Proven, Innovative, Dynamic
PREFERRED VERBS: Built, Designed, Led, Cut, Reduced, Delivered, Shipped, Established, Introduced, Drove, Defined, Architected, Integrated, Implemented, Migrated, Consolidated, Standardised

===========================================
JD-FIRST RULES
===========================================
- Skills and bullets are JD-driven first; factual anchors supply company names, dates, domains only.
- Retitle roles to JD language while matching seniority implied by anchors.
- Mirror JD terminology for ATS and recruiter skim.
- When the JD is thin on skills, apply SPARSE JD / RELATED SKILLS rules above so Cloud, Containers, and Observability rows and bullets are still present where the role implies production software delivery.
 - If a cloud provider is inferred as AWS/Azure/GCP, use that provider's terminology in the Cloud row and bullets. If Unspecified, stay provider-neutral (managed compute/storage/networking/IAM/monitoring) without naming AWS/Azure/GCP.

Output clean markdown only -- no commentary, no preamble, no trailing notes.`;

const FULLTIME_RESUME_SYSTEM = `You are a senior technical recruiter and resume writer specialising in full-time placements across software engineering levels. You write resumes that sound exactly like a human wrote them -- direct, confident, specific, and natural. Never templated, never formulaic, never AI-sounding.

Primary rule: This resume is written FOR the job description. Skills, summary, and experience bullets are composed fresh from the JD — not copied from the uploaded resume. Assume hands-on familiarity with JD requirements for this submission. Uploaded data supplies only factual anchors (identity, employers, dates, education).

BOLDING RULE (CRITICAL):
- Whenever you mention a technology/tool/framework/platform that comes from the JD requirement extraction (or the inferred cloud provider ecosystem), wrap the term in markdown bold like **Java 8**, **Spring Boot**, **Oracle**, **Angular 8**, **Kafka**.
- Apply this in the SUMMARY and all EXPERIENCE bullets.
- Do not bold generic words (team, system, service). Only bold concrete technical terms.

===========================================
OUTPUT FORMAT -- FOLLOW EXACTLY
===========================================

# [FULL NAME]
[Title -- match the seniority level in the JD]
[Location] - [Phone] - [Email] - [LinkedIn URL]

## SUMMARY
[Single paragraph. Exactly 3 sentences. NO bullets, NO hyphens. Plain prose only. Each sentence should explicitly reference top JD skills, architecture keywords, or outcomes so skills are visible directly in the summary.]

## TECHNICAL SKILLS
**Backend:** [values]
**Frontend:** [values]
**Cloud & Infra:** [values]
**Messaging:** [values]
**Data & Analytics:** [values]
**Security & CI/CD:** [values]
**Testing:** [values]

## EXPERIENCE

**[Job Title]** | **[Company]** | [Dates]
*[Project/Platform Name -- brief descriptor]*
- [bullet]
- [bullet]
- [bullet]
- [bullet]
(6-8 bullets for most recent role)

**[Job Title]** | **[Company]** | [Dates]
*[Project/Platform Name -- brief descriptor]*
- [bullet]
- [bullet]
- [bullet]
- [bullet]
(6-8 bullets for second role)

**[Job Title]** | **[Company]** | [Dates]
*[Project/Platform Name -- brief descriptor]*
- [bullet]
- [bullet]
- [bullet]
(4-6 bullets for all earlier roles)

## EDUCATION & CERTIFICATIONS
[Degree] -- [University], [Year]
[Degree] -- [University], [Year]

===========================================
SUMMARY RULES -- THIS IS CRITICAL
===========================================
EXACTLY 3 sentences. Plain paragraph. No bullets, no hyphens, no lists. If you write bullets you have failed.
- Sentence 1: "[Current/target title] targeting [job level in the JD]." -- state the target explicitly and mention 1-2 top JD skills.
- Sentence 2: Most differentiated tech combination + employer scale (name the company/domain), using JD language for stack where applicable.
- Sentence 3: 2-3 hard, concrete metrics from their actual experience, separated by commas, ideally tied to JD themes (quality, performance, delivery).
No soft claims. No "proven", "passionate", "strong communicator". Close on numbers. Make sure the summary itself visibly contains the core JD skills.

===========================================
SKILLS SECTION RULES
===========================================
Use EXACTLY these 7 category names in EXACTLY this order:
Backend | Frontend | Cloud & Infra | Messaging | Data & Analytics | Security & CI/CD | Testing

CRITICAL: Format as plain text rows -- bold label then colon then values. NEVER as a table.
Avoid duplicating the same skill across multiple categories unless needed for clarity.

===========================================
SPARSE JD / RELATED SKILLS (ALWAYS APPLY)
===========================================
If the JD names few technologies or skips cloud, containers, or observability, enrich the skills section and bullets with credible adjacent competencies for the inferred role (e.g. REST/microservices/full stack in production: include cloud managed services, container deployment patterns, CI/CD, and production monitoring). Align enrichment with the same ecosystem as the JD (languages/frameworks). For Cloud & Infra, populate concrete items unless the JD clearly excludes cloud work.

===========================================
BULLET DENSITY -- FULL-TIME ATS DENSITY
===========================================
Most recent role: 6-8 bullets
Second role: 6-8 bullets
Every earlier role: 4-6 bullets each
Keep total length tight, but prioritize keyword density and quantified impact for ATS/recruiter skim.

===========================================
BULLET WRITING RULES
===========================================
Every bullet must have: a metric OR a specific architectural decision. Never both vague.
Lead with the biggest differentiator for this JD at the top of each role.
Short punchy bullets often beat long compound ones on a 1-pager.
Vary structure: sometimes metric first, sometimes action first.
For each role heading, align the title with the target JD language while staying truthful to the candidate's actual scope and level.

BANNED WORDS: Successfully, Leveraged, Utilized, Spearheaded, Championed, Demonstrated, Ensured, Facilitated
PREFERRED VERBS: Built, Designed, Led, Cut, Reduced, Delivered, Shipped, Established, Introduced

===========================================
JD-FIRST RULES
===========================================
- Technical skills rows prioritize JD keywords first; when the JD is sparse, add related skills per SPARSE JD / RELATED SKILLS above. Experience bullets prove those skills per employer and date range from anchors.
- You may adjust role titles to market-standard equivalents while preserving seniority from anchors.
- Do not paste legacy resume bullet text.

Output clean markdown only -- no commentary, no preamble, no trailing notes.`;

const COVER_LETTER_SYSTEM = `You are an expert cover letter writer for contract and full-time roles. Write like a real person: plain English, short sentences, and a natural rhythm. The letter must feel human, not polished by a PR team.

STRUCTURE:
- Opening: One specific, confident sentence that proves you read the JD. No filler like "caught my attention" or "excited about this opportunity".
- Paragraph 1 (3-4 sentences): The one or two most relevant achievements that directly match the JD's priorities. Specific -- name the metric, the technology, the outcome.
- Paragraph 2 (3-4 sentences): A second thread -- leadership, a complementary technical area, or a project that shows range.
- Closing (2-3 sentences): Genuine interest in this specific role. State availability and next step. No "I look forward to hearing from you at your earliest convenience."
- Signature: End with a simple signature block on separate lines:
  Full Name
  Phone | Email
  LinkedIn URL (optional)

JD-FIRST RULES:
- Write the cover letter to match the target JD the same way the resume is tailored: mirror must-have keywords naturally and prioritise the JD's top responsibilities.
- Use FACT ANCHORS only for company names, dates, and domains; do NOT paste old resume bullets or skills lists.
- Never mention onsite interview, travel, relocation, commute, or availability to come onsite unless the JD explicitly requests that information.

CONSISTENCY CHECKS (CRITICAL):
- Only mention technologies that appear in the JD requirements list OR are clearly implied by the JD role (e.g. "SQL" implies relational DB work). Avoid random extras.
- If the JD lists messaging as JMS/Kafka, do not name a different broker unless the JD also allows it.
- If the role is "full stack" and the JD mentions a frontend framework, include one sentence showing frontend work (not just backend).
- Keep it tight: avoid long lists. Mention 4-7 key skills total across the whole letter.

IMPACT + DIFFERENTIATORS (CRITICAL):
- Include at least one concrete number (latency, cycle time, coverage, throughput, defect reduction, etc.) IF a defensible number exists in the provided fact anchors or JD text. If none are available, do not invent numbers.
- If the JD includes rare good-to-have items (e.g., GIS, Tableau, Kafka/JMS, integration testing), pick 1 and weave it in as a differentiator — but only if it appears in the JD requirement extraction.
- Avoid defensive phrasing like "without a ramp-up period". Say it positively (e.g., "I can plug in quickly and ship in the first sprint").

VOICE + VOCABULARY RULES (CRITICAL):
- Use simple words. Avoid fancy synonyms.
- Prefer verbs like: built, fixed, shipped, ran, owned, improved, cut, reduced, automated, reviewed, mentored.
- Keep sentences short (usually 10-18 words). Mix in a few very short ones.
- Avoid corporate filler: "delighted", "esteemed", "synergy", "leverage", "robust", "innovative", "cutting-edge", "dynamic", "passionate", "proven track record".
- Avoid academic phrasing: "therein", "thus", "utilize", "facilitate", "demonstrate", "aforementioned".
- No buzzword stacks. If you list 3+ tools, break the sentence.
- No flattery about the company. No hype.
- Contractions are fine (I'm, I've, don't).
- Avoid casual closers like "Happy to walk through". Prefer: "I'm available for a technical conversation at your convenience."

TONE: Confident but not arrogant. Human. First person. Contractions fine. No exclamation marks. No corporate jargon.
LENGTH: 3-4 short paragraphs. Under 300 words.
Format: plain paragraphs only -- no headers, no bullets. Start with "Dear Hiring Manager," or personalise if company is named.`;

// --- DOCX BUILDER ----------------------------------------------------------

async function buildDocx(markdownText, resumeType, parsedName) {
  // Load docx library from CDN (UMD build)
  if (!window.docx) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/docx@8.5.0/build/index.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const {
    Document, Packer, Paragraph, TextRun, AlignmentType,
    LevelFormat, BorderStyle, TabStopType, TabStopPosition,
    UnderlineType, HeadingLevel, ShadingType, WidthType
  } = window.docx;

  const NAVY_HEX = "1F3864";
  const ACCENT_HEX = "2B5EA7";
  const DARK_HEX = "1A1A1A";
  const MID_HEX = "445566";

  const lines = markdownText.split("\n");
  const children = [];
  const bulletRef = `bullets_${Date.now()}`;

  // Parse inline markdown: **bold**, *italic*, [link](url)
  function parseInline(text) {
    const runs = [];
    const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), font: "Calibri", size: 20, color: DARK_HEX }));
      if (m[2]) runs.push(new TextRun({ text: m[2], bold: true, font: "Calibri", size: 20, color: DARK_HEX }));
      else if (m[3]) runs.push(new TextRun({ text: m[3], italics: true, font: "Calibri", size: 20, color: MID_HEX }));
      last = m.index + m[0].length;
    }
    if (last < text.length) runs.push(new TextRun({ text: text.slice(last), font: "Calibri", size: 20, color: DARK_HEX }));
    return runs;
  }

  // Section divider line (border bottom on paragraph)
  function sectionHeading(text) {
    return new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), bold: true, font: "Calibri", size: 18, color: ACCENT_HEX })],
      spacing: { before: 160, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_HEX, space: 4 } }
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { children.push(new Paragraph({ spacing: { after: 40 } })); continue; }

    // # Name
    if (line.startsWith("# ")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2).trim(), bold: true, font: "Calibri", size: 32, color: NAVY_HEX })],
        spacing: { after: 40 }
      }));
      continue;
    }

    // ## Section heading
    if (line.startsWith("## ")) {
      children.push(sectionHeading(line.slice(3).trim()));
      continue;
    }

    // Availability line (bold standalone)
    if (trimmed.startsWith("**Availability:") || trimmed.startsWith("**Availability :")) {
      const content = trimmed.replace(/\*\*/g, "");
      children.push(new Paragraph({
        children: [new TextRun({ text: content, bold: true, font: "Calibri", size: 20, color: NAVY_HEX })],
        spacing: { after: 60 }
      }));
      continue;
    }

    // Role header line: **Title** | **Company** | Dates
    if (trimmed.match(/^\*\*[^*]+\*\*\s*\|\s*\*\*[^*]+\*\*/)) {
      // Parse out parts
      const parts = trimmed.split("|").map(p => p.trim());
      const titlePart = parts[0]?.replace(/\*\*/g, "") || "";
      const companyPart = parts[1]?.replace(/\*\*/g, "") || "";
      const datesPart = parts.slice(2).join("|").trim();
      children.push(new Paragraph({
        children: [
          new TextRun({ text: titlePart, bold: true, font: "Calibri", size: 21, color: DARK_HEX }),
          new TextRun({ text: "  |  ", font: "Calibri", size: 21, color: MID_HEX }),
          new TextRun({ text: companyPart, bold: true, font: "Calibri", size: 21, color: NAVY_HEX }),
          new TextRun({ text: "  |  ", font: "Calibri", size: 21, color: MID_HEX }),
          new TextRun({ text: datesPart, font: "Calibri", size: 20, color: MID_HEX }),
        ],
        spacing: { before: 120, after: 30 }
      }));
      continue;
    }

    // *Italic project line*
    if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed.slice(1, -1), italics: true, font: "Calibri", size: 20, color: MID_HEX })],
        spacing: { after: 30 }
      }));
      continue;
    }

    // - Bullet
    if (trimmed.startsWith("- ")) {
      children.push(new Paragraph({
        numbering: { reference: bulletRef, level: 0 },
        children: parseInline(trimmed.slice(2)),
        spacing: { after: 30 }
      }));
      continue;
    }

    // Skills row: **Label:** values
    if (trimmed.match(/^\*\*[^*]+:\*\*/)) {
      const colonIdx = trimmed.indexOf(":**");
      const label = trimmed.slice(2, colonIdx);
      const rest = trimmed.slice(colonIdx + 3).trim();
      children.push(new Paragraph({
        children: [
          new TextRun({ text: label + ": ", bold: true, font: "Calibri", size: 20, color: NAVY_HEX }),
          new TextRun({ text: rest, font: "Calibri", size: 20, color: DARK_HEX })
        ],
        spacing: { after: 40 }
      }));
      continue;
    }

    // Separator line
    if (trimmed === "---") continue;

    // Default paragraph with inline parsing
    children.push(new Paragraph({
      children: parseInline(trimmed),
      spacing: { after: 40 }
    }));
  }

  const doc = new Document({
    numbering: {
      config: [{
        reference: bulletRef,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "-",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 360, hanging: 240 } },
            run: { color: ACCENT_HEX, font: "Calibri", size: 20 }
          }
        }]
      }]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, right: 900, bottom: 720, left: 900 }
        }
      },
      children
    }]
  });

  const buf = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buf);
  const a = document.createElement("a");
  const safeType = resumeType === "contract" ? "Contract" : "FullTime";
  a.href = url;
  a.download = `${(parsedName || "Resume").replace(/\s+/g, "_")}_${safeType}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- COMPONENTS ---------------------------------------------------------------

const STEPS = ["Upload resume", "Resume type", "Job description", "Results"];

function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < current ? ACCENT : i === current ? NAVY : "#dde3ef",
              color: i <= current ? "#fff" : "#8899bb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, flexShrink: 0,
              border: i === current ? `2.5px solid ${ACCENT}` : "2.5px solid transparent",
              boxShadow: i === current ? `0 0 0 4px #2563eb14` : "none",
              transition: "all 0.25s"
            }}>
              {i < current ? "v" : i + 1}
            </div>
            <span style={{ fontSize: 10.5, color: i === current ? NAVY : "#8899bb", fontWeight: i === current ? 700 : 400, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? ACCENT : "#dde3ef", margin: "0 6px", marginBottom: 20, transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Btn({ onClick, disabled, children, variant = "primary", small }) {
  const bg = variant === "primary" ? (disabled ? "#b0bfd4" : ACCENT) : "transparent";
  const border = variant === "secondary" ? "1.5px solid #c8d4e8" : "none";
  const color = variant === "primary" ? "#fff" : "#445566";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "6px 14px" : "10px 26px",
      background: bg, border, color, borderRadius: 8,
      fontSize: small ? 12 : 13, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s"
    }}>{children}</button>
  );
}

function TabBtn({ active, onClick, children, icon }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "14px 12px",
      background: active ? NAVY : "#fff",
      border: `2px solid ${active ? NAVY : "#d0daea"}`,
      borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#fff" : NAVY }}>{children}</span>
    </button>
  );
}

function RenderDoc({ text }) {
  return (
    <div style={{ fontFamily: "Georgia, serif" }}>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 5 }} />;
        if (line.startsWith("# ")) return <h1 key={i} style={{ fontSize: 18, fontWeight: 700, color: NAVY, margin: "0 0 3px", fontFamily: "Georgia,serif" }}>{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 10.5, fontWeight: 700, color: ACCENT, borderBottom: `1.5px solid ${ACCENT}`, paddingBottom: 3, margin: "14px 0 6px", textTransform: "uppercase", letterSpacing: "0.09em", fontFamily: "system-ui,sans-serif" }}>{line.slice(3)}</h2>;
        if (line.match(/^\*\*.*\*\*\s*\|\s*\*\*/) || (line.startsWith("**") && line.includes("** | **"))) {
          return <p key={i} style={{ fontSize: 12.5, fontWeight: 700, color: "#111", margin: "10px 0 1px", fontFamily: "system-ui,sans-serif" }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
        }
        if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
          return <p key={i} style={{ fontSize: 11.5, fontStyle: "italic", color: "#778899", margin: "0 0 5px", fontFamily: "system-ui,sans-serif" }}>{line.slice(1, -1)}</p>;
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2, fontSize: 10 }}>-</span>
              <span style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.6, fontFamily: "system-ui,sans-serif" }} dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          );
        }
        if (line.match(/^\*\*[^*]+:\*\*/)) {
          return <p key={i} style={{ fontSize: 12, margin: "3px 0", lineHeight: 1.55, fontFamily: "system-ui,sans-serif" }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?):\*\*/g, `<strong style="color:${NAVY};font-family:system-ui,sans-serif">$1:</strong>`) }} />;
        }
        return <p key={i} style={{ fontSize: 12, color: "#223344", margin: "3px 0", lineHeight: 1.6, fontFamily: "system-ui,sans-serif" }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
      })}
    </div>
  );
}

function CoverLetterView({ text }) {
  return (
    <div style={{ fontFamily: "Georgia,serif", lineHeight: 1.8 }}>
      {text.split("\n\n").map((para, i) => (
        para.trim() ? <p key={i} style={{ fontSize: 13, color: "#1a2830", margin: "0 0 16px" }}>{para.trim()}</p> : null
      ))}
    </div>
  );
}

function extractJdRequirements(jdText) {
  const lines = jdText.split("\n").map(l => l.trim()).filter(Boolean);
  const normalize = (s) => s.replace(/^[\-\*\d\.\)\(]+\s*/, "").trim();
  const unique = (arr) => [...new Set(arr.map(v => v.trim()).filter(Boolean))];

  const mustHave = [];
  const goodToHave = [];

  for (const raw of lines) {
    const line = raw.toLowerCase();
    const value = normalize(raw);
    if (line.includes("must have") || line.includes("required") || line.includes("essential") || line.includes("mandatory")) {
      mustHave.push(value);
    } else if (line.includes("good to have") || line.includes("preferred") || line.includes("nice to have") || line.includes("plus")) {
      goodToHave.push(value);
    }
  }

  return { mustHave: unique(mustHave), goodToHave: unique(goodToHave) };
}

function inferCloudProvider(jdText) {
  const s = (jdText || "").toLowerCase();
  const hasAws = /\baws\b|amazon web services|\bec2\b|\bs3\b|\biam\b|\bcloudwatch\b|\brds\b/.test(s);
  const hasAzure = /\bazure\b|\baks\b|\bapp service\b|\bazure functions\b|\bmonitor\b|\bblob storage\b|\bcosmos db\b/.test(s);
  const hasGcp = /\bgcp\b|google cloud|\bgke\b|\bcloud run\b|\bcloud functions\b|\bbigquery\b|\bpub\/sub\b|\bcloud storage\b/.test(s);

  const providers = [];
  if (hasAws) providers.push("AWS");
  if (hasAzure) providers.push("Azure");
  if (hasGcp) providers.push("GCP");

  if (providers.length === 1) return providers[0];
  if (providers.length > 1) return "Multiple";
  return "Unspecified";
}

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{ padding: "6px 16px", background: copied ? "#27500A" : NAVY, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
      {copied ? "v Copied" : label || "Copy"}
    </button>
  );
}

function DocxBtn({ text, resumeType, parsedName }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      await buildDocx(text, resumeType, parsedName);
    } catch (e) {
      console.error(e);
      setError("Export failed -- try Copy instead.");
    }
    setExporting(false);
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
      <button onClick={handleExport} disabled={exporting} style={{
        padding: "6px 16px", background: exporting ? "#888" : "#1F3864",
        color: "#fff", border: "none", borderRadius: 7,
        fontSize: 12, fontWeight: 600, cursor: exporting ? "default" : "pointer"
      }}>
        {exporting ? "Generating..." : "v Download .docx"}
      </button>
      {error && <span style={{ fontSize: 11, color: "#a32d2d" }}>{error}</span>}
    </div>
  );
}

// --- BASELINE EXAMPLES (injected into the generation prompt for structure enforcement) -----

const CONTRACT_EXAMPLE_SNIPPET = `
EXAMPLE OF CORRECT CONTRACT PROFILE FORMAT (14 bullets, this topic order):
- [Years of experience + domain breadth]
- [Core stack aligned to proven experience and JD terms]
- [Most credible high-impact platform or project statement]
[...14 bullets total covering: experience breadth, tech stack, delivery metric, ML depth, cloud ownership, messaging, security, observability, IaC, API platform, people leadership, process improvement, engagement flexibility, cross-team delivery]

EXAMPLE OF CORRECT SELECTED TECHNICAL SKILLS (8-12 bullets):
- [JD must-have skill phrase]
- [JD must-have skill phrase]
- [JD strong good-to-have skill phrase]
- [JD strong good-to-have skill phrase]
- [Additional related production skill phrase when JD is thin]

EXAMPLE OF CORRECT SKILLS FORMAT:
**Languages:** [values from candidate data]
**Backend:** [values from candidate data]
**Frontend:** [values from candidate data]
**Cloud:** [JD + related cloud stack; omit only if role clearly non-cloud]
**Containers:** [JD + related container/deploy stack; omit only if role clearly excludes it]
**Messaging:** [values from candidate data]
**AI/ML Integration:** [values from candidate data]
**Security:** [values from candidate data]
**CI/CD & DevOps:** [values from candidate data]
**Testing:** [values from candidate data]
**Observability:** [values from candidate data]
**Data:** [values from candidate data]
**Methodologies:** [values from candidate data]
`;

const FULLTIME_EXAMPLE_SNIPPET = `
EXAMPLE OF CORRECT SUMMARY (3 sentences, plain paragraph, no bullets):
[Target title] targeting [job level in JD] roles, explicitly naming 1-2 core JD skills. [Most differentiating technical strengths tied to real experience and target domain, again using JD language where appropriate]. [2-3 concrete, defensible outcomes from candidate history that show impact in those skills].

EXAMPLE OF CORRECT SKILLS FORMAT:
**Backend:** [values from candidate data]
**Frontend:** [values from candidate data]
**Cloud & Infra:** [values from candidate data]
**Messaging:** [values from candidate data]
**Data & Analytics:** [values from candidate data]
**Security & CI/CD:** [values from candidate data]
**Testing:** [values from candidate data]

EXAMPLE OF CORRECT BULLET DENSITY:
Most recent role -- 6-8 bullets:
- [Bullet aligned to top JD requirement using proven experience]
- [Bullet aligned to architecture/implementation depth using proven experience]
- [Bullet aligned to security/scale/reliability using proven experience]
- [Bullet aligned to delivery/leadership outcome using proven experience]

Second role -- 6-8 bullets.
Earlier roles -- 4-6 bullets each.
`;

const ANTHROPIC_PROXY_URL = "/api/anthropic/messages";

async function callAnthropic(payload) {
  const resp = await fetch(ANTHROPIC_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    throw new Error(`Anthropic API ${resp.status}: ${errBody || "unknown error"}`);
  }

  return resp.json();
}

// --- MAIN APP ----------------------------------------------------------------

export default function App() {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [resumeType, setResumeType] = useState(null);
  const [jd, setJd] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [genError, setGenError] = useState("");
  const [activeTab, setActiveTab] = useState("resume");
  const fileRef = useRef();

  const handleFile = async (f) => {
    if (!f) return;

    const ext = f.name.split(".").pop().toLowerCase();

    // Block obviously non-resume files
    const blockedExts = ["jsx","js","ts","tsx","py","java","rb","go","rs","cpp","c","h","cs","php","css","json","zip","tar","gz","png","jpg","jpeg","gif","svg","mp4","mp3","exe","dmg"];
    if (blockedExts.includes(ext)) {
      setFileName(f.name);
      setParseError('"' + f.name + '" doesn\'t look like a resume. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    setFileName(f.name);
    setParseError("");
    setParsedData(null);
    setParsing(true);

    // -- Step 1: Build messageContent from file ------------------------------
    let messageContent;
    try {
      if (ext === "pdf" || f.type === "application/pdf") {
        const b64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result.split(",")[1]);
          r.onerror = rej;
          r.readAsDataURL(f);
        });
        messageContent = [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
          { type: "text", text: "Here is a resume. Extract all information from it and return ONLY a JSON object." }
        ];
      } else if (ext === "docx" || ext === "doc") {
        // Must use mammoth -- raw binary is unreadable by Claude
        if (!window.mammoth) {
          await new Promise((resolve, reject) => {
            const tryLoad = (src, cb) => {
              const s = document.createElement("script");
              s.src = src;
              s.onload = () => cb(null);
              s.onerror = () => cb(new Error("failed: " + src));
              document.head.appendChild(s);
            };
            tryLoad("https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js", (err) => {
              if (!err) { resolve(); return; }
              tryLoad("https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js", (err2) => {
                if (!err2) { resolve(); return; }
                reject(new Error("Could not load mammoth from CDN"));
              });
            });
          });
        }
        const arrayBuffer = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsArrayBuffer(f);
        });
        const mammoth = window.mammoth;
        const extractFn = mammoth?.extractRawText || mammoth?.extractRawValue;
        if (!extractFn) {
          throw new Error("Mammoth parser API not available");
        }
        const result = await extractFn({ arrayBuffer });
        const extractedText = (result.value || "").trim();
        if (!extractedText) {
          setParsing(false);
          setParseError("Word document appears empty. Please save as PDF and upload that instead.");
          return;
        }
        console.log("DOCX extracted", extractedText.length, "chars:", extractedText.slice(0, 200));
        messageContent = [{ type: "text", text: "Here is a resume. Extract all information from it and return ONLY a JSON object.\n\nRESUME CONTENT:\n" + extractedText }];
      } else {
        // TXT, MD, RTF, HTML, etc -- read as plain text
        const text = await new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result || "");
          r.onerror = () => res("");
          r.readAsText(f);
        });
        if (!text.trim()) {
          setParsing(false);
          setParseError("Could not read this file. Please try saving as PDF or plain text (.txt).");
          return;
        }
        console.log("Text file read", text.length, "chars:", text.slice(0, 200));
        messageContent = [{ type: "text", text: "Here is a resume. Extract all information from it and return ONLY a JSON object.\n\nRESUME CONTENT:\n" + text }];
      }
    } catch (readErr) {
      console.error("File read error:", readErr);
      setParsing(false);
      setParseError("Could not read this file (" + readErr.message + "). Try a PDF or .txt version.");
      return;
    }

    // -- Step 2: Send to Claude API ------------------------------------------
    try {
      const d = await callAnthropic({
        max_tokens: 3000,
        system: PARSE_SYSTEM,
        messages: [{ role: "user", content: messageContent }]
      });
      if (d.error) {
        console.error("Claude error:", d.error);
        setParsing(false);
        setParseError("Claude error: " + (d.error.message || JSON.stringify(d.error)));
        return;
      }

      const raw = d.content?.map(c => c.text || "").join("") || "";
      console.log("Claude response (" + raw.length + " chars):", raw.slice(0, 300));

      if (!raw.trim()) {
        setParsing(false);
        setParseError("Empty response from Claude. Please try again.");
        return;
      }

      // Extract JSON -- find outermost { }
      let parsed;
      try {
        const firstBrace = raw.indexOf("{");
        const lastBrace = raw.lastIndexOf("}");
        if (firstBrace === -1 || lastBrace <= firstBrace) {
          setParsing(false);
          setParseError("Could not find JSON in response. Claude said: " + raw.slice(0, 200));
          return;
        }
        parsed = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      } catch (jsonErr) {
        setParsing(false);
        setParseError("JSON parse error: " + jsonErr.message);
        return;
      }

      // Validate something was actually extracted
      const hasData = (parsed.name && parsed.name.trim()) ||
                      (Array.isArray(parsed.roles) && parsed.roles.some(r => r.company || r.title)) ||
                      (parsed.skills && parsed.skills.trim());
      if (!hasData) {
        setParsing(false);
        setParseError("Resume was read but no data was extracted. Try a PDF version for best results.");
        return;
      }

      setParsedData(parsed);
    } catch (apiErr) {
      console.error("API call failed:", apiErr);
      setParsing(false);
      const msg = String(apiErr?.message || "");
      if (msg.includes("Failed to fetch")) {
        setParseError("Cannot reach local API proxy. Make sure backend is running and then try again.");
      } else {
        setParseError("API error: " + msg);
      }
      return;
    }

    setParsing(false);
  };

  const generate = async () => {
    setGenerating(true);
    setGenError("");
    setResume("");
    setCoverLetter("");

    const systemPrompt = resumeType === "contract" ? CONTRACT_RESUME_SYSTEM : FULLTIME_RESUME_SYSTEM;
    const exampleSnippet = resumeType === "contract" ? CONTRACT_EXAMPLE_SNIPPET : FULLTIME_EXAMPLE_SNIPPET;
    const typeLabel = resumeType === "contract" ? "contract" : "full-time";
    const jdReq = extractJdRequirements(jd);
    const cloudProvider = inferCloudProvider(jd);
    const modeInstruction = "ALIGNMENT MODE: OPTIMIZED. Maximize JD keyword alignment and role-title normalization while preserving coherent project context.";

    const combinedPrompt = `FACT ANCHORS ONLY (from uploaded resume — use for identity, employer names, employment dates, degrees, certifications, and domain/project names ONLY):
${JSON.stringify(parsedData, null, 2)}

Do NOT copy this JSON's skills text or roles[].bullets into the output. Do NOT treat those fields as resume-ready content. Compose all technical skills rows and every professional bullet from scratch using the JD below while staying consistent with employers and timelines above.

TARGET JOB DESCRIPTION:
${jd}

JD REQUIREMENT EXTRACTION (derived from target JD):
${JSON.stringify(jdReq, null, 2)}

CLOUD PROVIDER INFERENCE:
${cloudProvider}

${exampleSnippet}

TASK: Produce TWO outputs: (1) the tailored ${typeLabel} resume and (2) a tailored cover letter. Return them in this exact format so we can split reliably:

===RESUME===
[the full resume markdown]
===COVER_LETTER===
[the cover letter text]

For the cover letter: assume the strongest, most relevant JD skills appear in the most recent role(s) and write confidently. Keep vocabulary simple, avoid buzzwords, and keep sentences short. Under 300 words. No AI openers. Do not mention onsite interview/travel/relocation/commute unless the JD explicitly requests it. Only name technologies that appear in the JD requirement extraction above; avoid unrelated tools. If the role is full stack and the JD mentions frontend, include one sentence that clearly signals frontend work.
End the cover letter with a signature block using the candidate contact from FACT ANCHORS:
Full Name
Phone | Email
LinkedIn (if available)

CRITICAL REQUIREMENTS:
1. Follow the output format in the system prompt EXACTLY -- section headings, structure, order
2. Skills section and all experience bullets are JD-first; factual anchors supply who/where/when only
3. Mirror the JD's exact keywords across profile, skills, and top experience bullets
4. Sound like a senior human professional wrote this -- varied sentence structure, no AI tells
5. Every section must match the baseline format shown in the example above
6. ${modeInstruction}
7. Internally ensure every must-have JD item is visible in skills or bullets; good-to-have items where space allows
8. Do not paste or lightly rephrase uploaded resume bullets or skills lists
9. If the JD lists very few skills, enrich with related standard skills for that role type (especially cloud, containers, CI/CD, observability) and reflect them in profile + experience bullets per system prompt
10. Bold technical terms (markdown **...**) when they come from JD requirements or inferred cloud provider services, especially in summary/profile and experience bullets.

Output both sections now.`;

    try {
      const d = await callAnthropic({ max_tokens: 5200, system: systemPrompt + "\n\n" + COVER_LETTER_SYSTEM, messages: [{ role: "user", content: combinedPrompt }] });
      const raw = d.content?.map(c => c.text || "").join("") || "";
      if (!raw.trim()) throw new Error("Generation returned empty text");

      const resIdx = raw.indexOf("===RESUME===");
      const covIdx = raw.indexOf("===COVER_LETTER===");
      if (resIdx === -1 || covIdx === -1 || covIdx <= resIdx) {
        throw new Error("Could not split output into RESUME and COVER_LETTER sections");
      }

      const resumeText = raw.slice(resIdx + "===RESUME===".length, covIdx).trim();
      const coverText = raw.slice(covIdx + "===COVER_LETTER===".length).trim();

      if (resumeText && coverText) {
        setResume(resumeText);
        setCoverLetter(coverText);
        setStep(3);
        setActiveTab("resume");
      } else {
        setGenError("Something went wrong generating one or more documents. Please try again.");
        console.error("Combined resp:", d);
      }
    } catch (e) {
      const msg = String(e?.message || "");
      if (msg.includes("Failed to fetch")) {
        setGenError("Cannot reach local API proxy. Make sure backend is running.");
      } else {
        setGenError("API error: " + msg);
      }
      console.error(e);
    }
    setGenerating(false);
  };

  const reset = () => {
    setStep(0); setFileName(""); setParsedData(null); setResumeType(null);
    setJd(""); setResume(""); setCoverLetter(""); setGenError(""); setParseError("");
  };

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", maxWidth: 820, margin: "0 auto", padding: "28px 20px" }}>

      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
          <div style={{ width: 5, height: 24, background: ACCENT, borderRadius: 2 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: NAVY, margin: 0 }}>Resume Builder</h1>
          {resumeType && step > 1 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: resumeType === "contract" ? "#EAF3DE" : "#E6F1FB", color: resumeType === "contract" ? "#27500A" : "#0C447C" }}>
              {resumeType === "contract" ? "Contract" : "Full-time"}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12.5, color: "#6b7a8d", margin: "0 0 0 15px" }}>
          Upload your resume -&gt; choose type -&gt; paste a job description -&gt; get a tailored resume and cover letter.
        </p>
      </div>

      <StepBar current={step} />

      {/* -- STEP 0: UPLOAD -- */}
      {step === 0 && (
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Upload your existing resume</h2>
          <p style={{ fontSize: 12.5, color: "#6b7a8d", marginBottom: 20 }}>We extract your details, work history, and skills automatically. Any file format works -- PDF, DOCX, TXT, RTF, and more.</p>

          <div onClick={() => !parsing && fileRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            style={{ border: `2px dashed ${parsing ? ACCENT : "#c0cedc"}`, borderRadius: 12, padding: "44px 24px", textAlign: "center", cursor: parsing ? "default" : "pointer", background: parsing ? "#f0f5ff" : "#fafbfd", transition: "all 0.2s", marginBottom: 16 }}>
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

            {parsing ? (
              <div>
                <div style={{ fontSize: 30, marginBottom: 10, opacity: 0.7 }}></div>
                <p style={{ fontWeight: 700, color: NAVY, margin: "0 0 4px", fontSize: 14 }}>Parsing your resume...</p>
                <p style={{ fontSize: 12, color: "#6b7a8d", margin: 0 }}>Extracting your details, roles, and skills</p>
              </div>
            ) : fileName && !parseError ? (
              <div>
                <div style={{ fontSize: 30, marginBottom: 8 }}></div>
                <p style={{ fontWeight: 700, color: NAVY, margin: "0 0 4px", fontSize: 14 }}>{fileName}</p>
                <p style={{ fontSize: 12, color: "#6b7a8d", margin: 0 }}>Click to upload a different file</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>^</div>
                <p style={{ fontWeight: 700, color: NAVY, margin: "0 0 6px", fontSize: 14 }}>Click to upload or drag & drop</p>
                <p style={{ fontSize: 12, color: "#6b7a8d", margin: 0 }}>PDF . DOCX . TXT . RTF . any format</p>
              </div>
            )}
          </div>

          {parseError && <div style={{ padding: "10px 14px", background: "#fcebeb", border: "1px solid #f09595", borderRadius: 8, fontSize: 13, color: "#a32d2d", marginBottom: 14 }}>{parseError}</div>}

          {parsedData && !parsing && (
            <div style={{ padding: "16px 18px", background: "#eaf3de", border: "1px solid #c0dd97", borderRadius: 10 }}>
              <p style={{ fontWeight: 700, color: "#27500a", margin: "0 0 10px", fontSize: 13 }}>v Resume parsed successfully</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", fontSize: 12, color: "#3b6d11", marginBottom: 14 }}>
                {parsedData.name && <span>- Name: <strong>{parsedData.name}</strong></span>}
                {parsedData.email && <span>- Email: {parsedData.email}</span>}
                {parsedData.roles?.length > 0 && <span>- Roles found: <strong>{parsedData.roles.length}</strong></span>}
                {parsedData.skills && <span>- Skills: extracted</span>}
                {parsedData.education && <span>- Education: extracted</span>}
                {parsedData.certifications && <span>- Certifications: found</span>}
              </div>
              <Btn onClick={() => setStep(1)}>Continue -&gt;</Btn>
            </div>
          )}
        </div>
      )}

      {/* -- STEP 1: RESUME TYPE -- */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>What type of resume do you need?</h2>
          <p style={{ fontSize: 12.5, color: "#6b7a8d", marginBottom: 20 }}>Each type is structured differently. Choose based on the role you're applying for.</p>

          <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
            <TabBtn active={resumeType === "contract"} onClick={() => setResumeType("contract")} icon="">Contract Resume</TabBtn>
            <TabBtn active={resumeType === "fulltime"} onClick={() => setResumeType("fulltime")} icon="">Full-time Resume</TabBtn>
          </div>

          {resumeType && (
            <div style={{ padding: "14px 16px", background: LIGHT, borderRadius: 10, marginBottom: 20, fontSize: 12.5, color: "#334455", lineHeight: 1.7 }}>
              {resumeType === "contract" ? (
                <><strong style={{ color: NAVY }}>Contract resume</strong> -- longer format with a detailed 14-bullet profile section, 13-category technical competencies, and 12-14 bullets per role. Designed for W2/C2C/1099 contract and consulting opportunities. Highlights availability, engagement flexibility, and breadth of technical delivery.</>
              ) : (
                <><strong style={{ color: NAVY }}>Full-time resume</strong> -- tight one-page format with a 3-sentence summary paragraph, 6-category skills, and exactly 4/4/3 bullets per role. Designed for Staff Engineer, Principal Engineer, or Technical Lead permanent positions. Every word earns its place.</>
              )}
            </div>
          )}

          <p style={{ fontSize: 12, color: "#6b7a8d", marginBottom: 20 }}>Both types include a tailored cover letter generated at the same time.</p>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn onClick={() => setStep(0)} variant="secondary">&lt;- Back</Btn>
            <Btn onClick={() => setStep(2)} disabled={!resumeType}>Continue -&gt;</Btn>
          </div>
        </div>
      )}

      {/* -- STEP 2: JOB DESCRIPTION -- */}
      {step === 2 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: 0 }}>Paste the job description</h2>
            {parsedData?.name && <span style={{ fontSize: 11, background: "#eaf3de", color: "#3b6d11", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>{parsedData.name}</span>}
            <span style={{ fontSize: 11, background: resumeType === "contract" ? "#eaf3de" : "#e6f1fb", color: resumeType === "contract" ? "#27500a" : "#0c447c", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>
              {resumeType === "contract" ? "Contract" : "Full-time"}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: "#6b7a8d", marginBottom: 16 }}>The resume and cover letter will be written to match the JD's exact keywords, priorities, and required skills.</p>

          <textarea value={jd} onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here -- responsibilities, required skills, qualifications, and any preferred experience. The more complete the JD, the better the tailoring."
            rows={16}
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #d0dbe8", fontSize: 13, color: "#1a1a1a", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />

          {genError && <div style={{ margin: "8px 0", padding: "10px 14px", background: "#fcebeb", border: "1px solid #f09595", borderRadius: 8, fontSize: 13, color: "#a32d2d" }}>{genError}</div>}

          {generating && (
            <div style={{ margin: "14px 0", padding: "16px 18px", background: "#f0f5ff", border: "1px solid #b5d4f4", borderRadius: 10 }}>
              <p style={{ fontWeight: 700, color: NAVY, margin: "0 0 10px", fontSize: 13 }}>Generating your resume and cover letter...</p>
              <div style={{ fontSize: 12, color: "#445566", display: "flex", flexDirection: "column", gap: 5 }}>
                <span>- Analysing job description keywords and priorities</span>
                <span>- Rewriting your experience to match the role</span>
                <span>- Enforcing structural rules and bullet density</span>
                <span>- Crafting natural, human-sounding language throughout</span>
                <span>- Writing a tailored cover letter in parallel</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <Btn onClick={() => setStep(1)} variant="secondary">&lt;- Back</Btn>
            <Btn onClick={generate} disabled={jd.trim().length < 50 || generating}>
              {generating ? "Generating..." : "Generate resume + cover letter ->"}
            </Btn>
          </div>
        </div>
      )}

      {/* -- STEP 3: RESULTS -- */}
      {step === 3 && resume && coverLetter && (
        <div>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 0, marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1.5px solid #d0dbe8" }}>
            {[["resume", "Resume"], ["cover", "Cover Letter"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                flex: 1, padding: "10px 0", background: activeTab === key ? NAVY : "#fff",
                border: "none", color: activeTab === key ? "#fff" : "#445566",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}>{label}</button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => { setStep(2); setResume(""); setCoverLetter(""); }} variant="secondary" small>&lt;- Different JD</Btn>
              <Btn onClick={reset} variant="secondary" small>New resume</Btn>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {activeTab === "resume" && (
                <DocxBtn text={resume} resumeType={resumeType} parsedName={parsedData?.name} />
              )}
              <CopyBtn text={activeTab === "resume" ? resume : coverLetter} label={activeTab === "resume" ? "Copy resume" : "Copy cover letter"} />
            </div>
          </div>

          {/* Document display */}
          <div style={{ border: "1.5px solid #d0dbe8", borderRadius: 12, padding: "28px 32px", background: "#fff", boxShadow: "0 2px 16px rgba(26,46,74,0.07)" }}>
            {activeTab === "resume" ? <RenderDoc text={resume} /> : <CoverLetterView text={coverLetter} />}
          </div>

          <div style={{ marginTop: 14, padding: "12px 16px", background: LIGHT, borderRadius: 8, fontSize: 12, color: "#556677", lineHeight: 1.7 }}>
            <strong style={{ color: NAVY }}>Next steps:</strong> Download the .docx or copy the text. Review every bullet -- confirm all metrics are accurate and defensible in interview. For a different job using the same resume, click "Different JD."
          </div>
        </div>
      )}
    </div>
  );
}
