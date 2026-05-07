import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCachedSummaries, cacheSummaries } from "./summaryCache.js";

const profilePool = [
  {
    id: "C-001",
    name: "Nur A.",
    role: "Customer Service Executive",
    jobType: "Customer Service",
    latestPosition: "Customer Service Executive at Shopee Malaysia",
    industry: "E-commerce / Retail",
    careerSnapshot: "Grew from frontline CS agent to senior rep in 2 years; handled escalations independently",
    urgency: "Actively looking · available immediately",
    location: "Shah Alam",
    experience: "3 years",
    availability: "Immediate",
    education: "Diploma in Business Administration",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Full-time, office-based",
    commute: "Own transport; Klang Valley preferred",
    qualitySignals: ["Handled 80+ live chat and call tickets daily during Shopee peak sale periods", "Bilingual Mandarin/English — manages Chinese-speaking customer segment without handoff", "Maintained 95%+ first-response SLA record across 3 consecutive quarters"],
    match: 92,
    skills: ["Mandarin", "CRM", "WhatsApp Support", "Retail Support"],
    maskedPhone: "+60 12-XXX 4891",
    maskedEmail: "nu***@gmail.com",
  },
  {
    id: "C-002",
    name: "Lim K.",
    role: "Sales Executive",
    jobType: "Sales",
    latestPosition: "Sales Executive at Axiata Group",
    industry: "Telecommunications",
    careerSnapshot: "Progressed from junior rep to senior sales executive; managed 3 key corporate accounts",
    urgency: "Actively interviewing · 1 offer pending",
    location: "Puchong",
    experience: "5 years",
    availability: "2 weeks",
    education: "Bachelor's Degree in Marketing",
    languages: ["English", "Mandarin", "Malay"],
    workPreference: "Field sales; open to hybrid",
    commute: "Own car; open to Klang Valley travel",
    qualitySignals: ["Hit or exceeded 100% monthly sales quota across telco B2B accounts for 3 consecutive years", "Managed enterprise pipeline of RM500K+ per quarter with structured CRM follow-up", "Bilingual closer — converts Chinese SME accounts that English-only reps cannot reach"],
    match: 88,
    skills: ["B2B Sales", "Lead Follow-up", "English", "Klang Valley"],
    maskedPhone: "+60 16-XXX 7732",
    maskedEmail: "li***@outlook.com",
  },
  {
    id: "C-003",
    name: "Aisyah R.",
    role: "Accounts & Admin Executive",
    jobType: "Accounting",
    latestPosition: "Accounts & Admin Executive at Petronas",
    industry: "Oil & Gas / Corporate Services",
    careerSnapshot: "2 years at Petronas handling AP/AR and admin for corporate division; left due to contract non-renewal",
    urgency: "Actively looking · available immediately",
    location: "Kuala Lumpur",
    experience: "2 years",
    availability: "Immediate",
    education: "Diploma in Accounting & Office Management",
    languages: ["Malay", "English"],
    workPreference: "Full-time, office-based",
    commute: "Public transport; prefers KL/PJ area",
    qualitySignals: ["Handled AP/AR reconciliation for Petronas corporate division with zero audit exceptions", "Managed petty cash, payment processing, and vendor invoice tracking independently", "Proficient in SQL Accounting and Excel with pivot-table-level reporting"],
    match: 84,
    skills: ["SQL Accounting", "AP/AR", "Excel", "Reconciliation"],
    maskedPhone: "+60 11-XXX 1290",
    maskedEmail: "ai***@yahoo.com",
  },
  {
    id: "C-004",
    name: "Jason T.",
    role: "Warehouse Supervisor",
    jobType: "Logistics",
    latestPosition: "Warehouse Supervisor at Lazada Malaysia",
    industry: "E-commerce Logistics",
    careerSnapshot: "Promoted from picker to supervisor within 3 years; managed team of 15 through 11.11 and 12.12 peaks",
    urgency: "Open to offers · 1 month notice negotiable",
    location: "Klang",
    experience: "7 years",
    availability: "1 month",
    education: "SPM; CIDB green card; warehouse safety certification",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Full-time; open to shift work",
    commute: "Own transport; prefers Klang/Shah Alam",
    qualitySignals: ["Led 15-person team through Lazada 11.11 and 12.12 peak fulfilment with zero SLA breach", "Reduced picking error rate by 20% through process change implemented independently", "CIDB-certified, forklift-licensed, zero lost-time accident record across 7 years"],
    match: 87,
    skills: ["Inventory", "Forklift", "Shift Planning", "Team Lead"],
    maskedPhone: "+60 17-XXX 6650",
    maskedEmail: "ja***@gmail.com",
  },
  {
    id: "C-005",
    name: "Mei S.",
    role: "HR & Payroll Executive",
    jobType: "Accounting",
    latestPosition: "HR & Payroll Executive at AirAsia",
    industry: "Aviation / Shared Services",
    careerSnapshot: "6 years across F&B and aviation HR; handled multi-entity payroll for 500+ headcount",
    urgency: "Actively interviewing · 2 interviews scheduled this week",
    location: "Petaling Jaya",
    experience: "6 years",
    availability: "2 weeks",
    education: "Bachelor's Degree in Human Resource Management",
    languages: ["English", "Mandarin", "Malay"],
    workPreference: "Full-time; hybrid acceptable",
    commute: "Own transport; PJ/Subang/KL preferred",
    qualitySignals: ["Processed payroll for 500+ employees across 3 entities monthly with zero late disbursements", "Managed end-to-end recruitment for 40+ hires per year including onboarding and contract issuance", "Full EA 1955, EPF, SOCSO, and EIS compliance handled independently — no outsourcing required"],
    match: 86,
    skills: ["Payroll", "HR2000", "Recruitment", "Mandarin"],
    maskedPhone: "+60 13-XXX 9044",
    maskedEmail: "me***@icloud.com",
  },
  {
    id: "C-006",
    name: "Farah Z.",
    role: "Digital Marketing Executive",
    jobType: "Marketing",
    latestPosition: "Digital Marketing Executive at Shopee Malaysia",
    industry: "E-commerce / Tech",
    careerSnapshot: "3 years at Shopee managing paid performance channels; promoted to regional campaign lead in year 2",
    urgency: "Actively looking · available immediately",
    location: "Bangsar South",
    experience: "3 years",
    availability: "Immediate",
    education: "Bachelor's Degree in Mass Communication",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Hybrid; open to full-time office",
    commute: "Own transport; KL/PJ area preferred",
    qualitySignals: ["Managed RM200K+ monthly paid media budget across Meta and Google with 3.8x average ROAS", "Led 11.11 campaign creative strategy reaching 2M impressions in 48 hours", "Built affiliate channel from scratch — grew to 300+ active partners in 18 months"],
    match: 91,
    skills: ["Meta Ads", "Google Ads", "Performance Marketing", "Mandarin"],
    maskedPhone: "+60 14-XXX 2210",
    maskedEmail: "fa***@gmail.com",
  },
  {
    id: "C-007",
    name: "Ahmad R.",
    role: "Accounts Executive",
    jobType: "Accounting",
    latestPosition: "Accounts Executive at Maybank",
    industry: "Banking / Financial Services",
    careerSnapshot: "4 years at Maybank handling full-set accounts; ACCA Part 2 qualified",
    urgency: "Open to offers · 2 weeks notice",
    location: "Kuala Lumpur",
    experience: "4 years",
    availability: "2 weeks",
    education: "Diploma in Accounting; ACCA Part 2",
    languages: ["Malay", "English"],
    workPreference: "Full-time, office-based",
    commute: "Public transport; prefers KL city centre",
    qualitySignals: ["Maintained full-set accounts for 3 subsidiary entities under Maybank Group", "Reduced month-end close cycle from 8 to 5 days by restructuring reconciliation workflow", "Managed statutory audit preparation with zero prior-year adjustments for 3 consecutive years"],
    match: 90,
    skills: ["Full-set Accounts", "ACCA", "SAP", "Audit Prep"],
    maskedPhone: "+60 16-XXX 5580",
    maskedEmail: "ah***@yahoo.com",
  },
  {
    id: "C-008",
    name: "Siti N.",
    role: "F&B Supervisor",
    jobType: "F&B",
    latestPosition: "F&B Supervisor at McDonald's Malaysia",
    industry: "F&B / Quick Service Restaurant",
    careerSnapshot: "Promoted from crew to supervisor in 18 months; managed outlet of 25 staff during peak trading",
    urgency: "Actively looking · available immediately",
    location: "Petaling Jaya",
    experience: "4 years",
    availability: "Immediate",
    education: "SPM; McDonald's internal management certification",
    languages: ["Malay", "English"],
    workPreference: "Full-time; shift work acceptable",
    commute: "Own transport; Klang Valley preferred",
    qualitySignals: ["Supervised 25-person outlet team across breakfast and lunch peak shifts", "Reduced food waste by 15% by implementing better prep forecasting on weekday mornings", "Achieved 4.6-star Google rating for outlet under her supervision — highest in district"],
    match: 88,
    skills: ["F&B Operations", "Shift Management", "HACCP", "Team Lead"],
    maskedPhone: "+60 11-XXX 7720",
    maskedEmail: "si***@gmail.com",
  },
  {
    id: "C-009",
    name: "Lee W.",
    role: "Production Supervisor",
    jobType: "Manufacturing",
    latestPosition: "Production Supervisor at Top Glove",
    industry: "Manufacturing / Healthcare Products",
    careerSnapshot: "Rose from line operator to production supervisor in 4 years; managed 40-person production line",
    urgency: "Open to offers · 1 month notice",
    location: "Shah Alam",
    experience: "6 years",
    availability: "1 month",
    education: "Diploma in Industrial Engineering",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Full-time; shift work acceptable",
    commute: "Own transport; Shah Alam/Klang preferred",
    qualitySignals: ["Supervised 40-person production line at Top Glove achieving 98.5% output efficiency", "Led ISO 9001 internal audit preparation with zero major non-conformances", "Reduced line downtime by 12% through preventive maintenance scheduling improvement"],
    match: 85,
    skills: ["Production Planning", "ISO 9001", "Line Management", "Mandarin"],
    maskedPhone: "+60 17-XXX 3340",
    maskedEmail: "le***@outlook.com",
  },
  {
    id: "C-010",
    name: "Priya K.",
    role: "Retail Sales Supervisor",
    jobType: "Retail",
    latestPosition: "Retail Sales Supervisor at AEON Malaysia",
    industry: "Retail / Department Store",
    careerSnapshot: "Promoted from sales associate to supervisor managing 12-person floor team within 3 years",
    urgency: "Actively interviewing · 1 offer pending",
    location: "Subang Jaya",
    experience: "5 years",
    availability: "2 weeks",
    education: "Diploma in Business Studies",
    languages: ["Malay", "English", "Tamil"],
    workPreference: "Full-time; shift work acceptable",
    commute: "Own transport; PJ/Subang/Shah Alam preferred",
    qualitySignals: ["Managed 12-person retail floor team across fashion and homeware departments at AEON", "Consistently ranked top 3 in-store for upselling and add-on attachment rate", "Handled opening/closing procedures, cash reconciliation, and daily stock counts independently"],
    match: 87,
    skills: ["Retail Ops", "Team Lead", "POS Systems", "Tamil"],
    maskedPhone: "+60 12-XXX 8891",
    maskedEmail: "pr***@gmail.com",
  },
  {
    id: "C-011",
    name: "Kevin O.",
    role: "Logistics Coordinator",
    jobType: "Logistics",
    latestPosition: "Logistics Coordinator at DHL Malaysia",
    industry: "Freight & Logistics",
    careerSnapshot: "3 years at DHL coordinating inbound/outbound across Klang Valley; managed 50+ daily shipments",
    urgency: "Actively looking · available immediately",
    location: "Port Klang",
    experience: "3 years",
    availability: "Immediate",
    education: "Diploma in Logistics & Supply Chain",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Full-time; open to flexible hours",
    commute: "Own transport; Port Klang/Shah Alam preferred",
    qualitySignals: ["Coordinated 50+ daily inbound/outbound shipments across Klang Valley with 99.2% on-time rate", "Managed customs documentation and import clearance independently", "Reduced freight cost per kg by 8% through carrier renegotiation and route consolidation"],
    match: 83,
    skills: ["Freight Coordination", "Customs Docs", "SAP", "Mandarin"],
    maskedPhone: "+60 16-XXX 4430",
    maskedEmail: "ke***@icloud.com",
  },
  {
    id: "C-012",
    name: "Tan B.",
    role: "Telesales Executive",
    jobType: "Sales",
    latestPosition: "Telesales Executive at Maxis",
    industry: "Telecommunications",
    careerSnapshot: "Top 10% telesales performer at Maxis for 2 years running; mentored 3 new joiners",
    urgency: "Actively looking · available immediately",
    location: "Cheras",
    experience: "2 years",
    availability: "Immediate",
    education: "SPM; Maxis internal sales certification",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Office-based; target-driven environment preferred",
    commute: "Own transport; KL/Cheras preferred",
    qualitySignals: ["Ranked top 10% in Maxis telesales division with 115% average monthly quota attainment", "Mandarin-speaking — closes Chinese-speaking leads that non-bilingual reps hand off", "Converted 35% of cold call leads to subscription upgrades — above 22% team average"],
    match: 82,
    skills: ["Telesales", "Mandarin", "Cold Calling", "Telco Products"],
    maskedPhone: "+60 11-XXX 6640",
    maskedEmail: "ta***@gmail.com",
  },
  {
    id: "C-013",
    name: "Rania H.",
    role: "Brand & Content Executive",
    jobType: "Marketing",
    latestPosition: "Brand & Content Executive at AirAsia",
    industry: "Aviation / Consumer Brand",
    careerSnapshot: "2 years at AirAsia managing social media and brand collateral across 4 Southeast Asian markets",
    urgency: "Open to offers · 2 weeks notice",
    location: "Kuala Lumpur",
    experience: "2 years",
    availability: "2 weeks",
    education: "Bachelor's Degree in Communications & Media",
    languages: ["Malay", "English"],
    workPreference: "Hybrid preferred; open to full office",
    commute: "Public transport; KL area preferred",
    qualitySignals: ["Managed AirAsia social channels across MY, TH, ID, PH — combined 8M+ follower base", "Produced 40+ content pieces monthly including short-form video, EDM, and landing page copy", "Grew Instagram engagement rate from 1.8% to 4.2% in 6 months through content calendar overhaul"],
    match: 85,
    skills: ["Social Media", "Content Writing", "Canva", "EDM"],
    maskedPhone: "+60 13-XXX 1120",
    maskedEmail: "ra***@outlook.com",
  },
  {
    id: "C-014",
    name: "Zulaikha M.",
    role: "Customer Service Lead",
    jobType: "Customer Service",
    latestPosition: "Customer Service Lead at Maybank",
    industry: "Banking / Financial Services",
    careerSnapshot: "Promoted to CS lead after 2 years; manages 8-person team handling banking enquiries and complaints",
    urgency: "Actively interviewing · 2 interviews scheduled",
    location: "Kuala Lumpur",
    experience: "4 years",
    availability: "2 weeks",
    education: "Bachelor's Degree in Business Administration",
    languages: ["Malay", "English"],
    workPreference: "Full-time, office-based",
    commute: "Public transport; KL/PJ preferred",
    qualitySignals: ["Led 8-person CS team at Maybank handling 200+ daily banking enquiries and complaints", "Reduced average resolution time from 48 hours to 22 hours through case triage redesign", "Achieved 4.8/5 CSAT score across Q3–Q4 2024 — highest in branch network"],
    match: 90,
    skills: ["Team Lead", "Banking CS", "Complaint Resolution", "CSAT"],
    maskedPhone: "+60 12-XXX 3350",
    maskedEmail: "zu***@yahoo.com",
  },
  {
    id: "C-015",
    name: "Eric L.",
    role: "QC Inspector",
    jobType: "Manufacturing",
    latestPosition: "QC Inspector at Hartalega",
    industry: "Manufacturing / Medical Devices",
    careerSnapshot: "5 years in QC at Hartalega; promoted to senior inspector and trained 6 new team members",
    urgency: "Open to offers · 1 month notice",
    location: "Bestari Jaya",
    experience: "5 years",
    availability: "1 month",
    education: "Diploma in Quality Management",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Full-time; shift work acceptable",
    commute: "Own transport; Bestari Jaya/KL area",
    qualitySignals: ["Conducted in-process and final QC inspections across 3 production lines at Hartalega", "Maintained defect rate below 0.3% for 2 consecutive years — below industry benchmark", "Trained 6 new QC inspectors on ISO 13485 and GMP documentation standards"],
    match: 83,
    skills: ["QC Inspection", "ISO 13485", "GMP", "Mandarin"],
    maskedPhone: "+60 17-XXX 9910",
    maskedEmail: "er***@gmail.com",
  },
  {
    id: "C-016",
    name: "Daniel C.",
    role: "Restaurant Manager",
    jobType: "F&B",
    latestPosition: "Restaurant Manager at Starbucks Malaysia",
    industry: "F&B / Coffee & Beverages",
    careerSnapshot: "Started as barista, promoted to shift lead then manager in 4 years; manages outlet of 18 staff",
    urgency: "Actively looking · available immediately",
    location: "Ampang",
    experience: "5 years",
    availability: "Immediate",
    education: "SPM; Starbucks internal leadership programme",
    languages: ["Malay", "English", "Mandarin"],
    workPreference: "Full-time; shift work acceptable",
    commute: "Own transport; KL/Ampang/Cheras preferred",
    qualitySignals: ["Managed RM80K+ monthly revenue outlet with 18-person team across 3 daily shifts", "Achieved highest Mystery Shopper score in KL East district for 2 consecutive quarters", "Reduced staff turnover from 60% to 28% by implementing structured onboarding and shift fairness policy"],
    match: 89,
    skills: ["F&B Management", "P&L Awareness", "Team Lead", "Mandarin"],
    maskedPhone: "+60 16-XXX 7760",
    maskedEmail: "da***@gmail.com",
  },
  {
    id: "C-017",
    name: "Nadia F.",
    role: "Visual Merchandising Executive",
    jobType: "Retail",
    latestPosition: "Visual Merchandising Executive at Parkson",
    industry: "Retail / Department Store",
    careerSnapshot: "3 years at Parkson owning VM standards across 4 outlets; led seasonal rebranding rollout",
    urgency: "Open to offers · 2 weeks notice",
    location: "Kuala Lumpur",
    experience: "3 years",
    availability: "2 weeks",
    education: "Diploma in Fashion & Retail Management",
    languages: ["Malay", "English"],
    workPreference: "Full-time; field travel acceptable",
    commute: "Own transport; KL/PJ/Selangor preferred",
    qualitySignals: ["Managed VM execution across 4 Parkson outlets covering menswear, womenswear, and accessories", "Led seasonal floor rebranding for 2 floors — delivered 2 days ahead of schedule, zero budget overrun", "Trained 15 floor staff on VM standards and planogram compliance, reducing setup errors by 40%"],
    match: 84,
    skills: ["Visual Merchandising", "Planogram", "Retail Ops", "Training"],
    maskedPhone: "+60 14-XXX 5530",
    maskedEmail: "na***@gmail.com",
  },
];

const JOB_TYPES = ["Customer Service", "Sales", "Marketing", "Accounting", "Retail", "F&B", "Manufacturing", "Logistics"];

const candidateApplications = {
  "C-001": 3, "C-002": 4, "C-003": 2, "C-004": 1, "C-005": 5,
  "C-006": 3, "C-007": 2, "C-008": 2, "C-009": 1, "C-010": 4,
  "C-011": 2, "C-012": 3, "C-013": 2, "C-014": 5, "C-015": 1,
  "C-016": 3, "C-017": 2,
};

const API_BASE_URL = "https://api.ajobthing.com";
const CANDIDATE_SEARCH_API_BASE_URL = "https://candidate-search-api.ajt.my";

const JOB_TYPE_TO_TITLE = {
  "Customer Service": "customer service",
  "Sales": "sales",
  "Marketing": "marketing",
  "Accounting": "accounting",
  "Retail": "retail",
  "F&B": "food and beverage",
  "Manufacturing": "manufacturing",
  "Logistics": "logistics",
};

// Keywords that must appear in the candidate's CURRENT role/position to pass the post-filter.
// This guards against the API returning semantically wrong results (e.g. teachers for CS).
const JOB_TYPE_ROLE_KEYWORDS = {
  "Customer Service": ["customer service", "customer support", "cs executive", "cs officer", "call centre", "call center", "contact centre", "helpdesk", "help desk", "client service", "client support", "customer care", "customer relations", "customer experience"],
  "Sales": ["sales", "business development", "account executive", "account manager", "telesales", "telemarketing", "bdm", "key account"],
  "Marketing": ["marketing", "digital marketing", "brand", "content", "media", "seo", "social media", "campaign", "communications", "copywriter", "advertis"],
  "Accounting": ["account", "finance", "audit", "tax", "bookkeep", "payroll", "treasury", "controller", "cfo", "financial"],
  "Retail": ["retail", "merchandise", "visual merch", "store", "shop assistant", "sales associate", "floor staff"],
  "F&B": ["food", "beverage", "restaurant", "kitchen", "chef", "cook", "barista", "waiter", "waitress", "f&b", "cafe", "outlet"],
  "Manufacturing": ["manufactur", "production", "assembly", "quality control", "qc", "qc inspector", "line leader", "operator", "process engineer", "plant"],
  "Logistics": ["logistic", "warehouse", "supply chain", "delivery", "dispatch", "freight", "inventory", "store keeper", "shipping", "import", "export", "customs"],
};

function roleMatchesJobType(profile, jobType) {
  const keywords = JOB_TYPE_ROLE_KEYWORDS[jobType];
  if (!keywords) return true;
  const text = [profile.role, profile.latestPosition, profile.jobType].join(" ").toLowerCase().trim();
  if (!text) return true;
  return keywords.some((kw) => text.includes(kw));
}

// For live data: category matching with three tiers:
// 1. interest_job_category (canonical) → keyword match against selected type
// 2. jobType fallback (preferredJobTitle / expJobTitle) → only restrict if it matches
//    exactly ONE category (unambiguous). Ambiguous titles like "Account Executive"
//    (matches both Sales and Accounting) pass through rather than wrong-reject.
// 3. No usable signal → trust the API
function seekingMatchesJobType(profile, jobType) {
  const keywords = JOB_TYPE_ROLE_KEYWORDS[jobType];
  if (!keywords) return true;

  if (profile.jobCategory) {
    return keywords.some((kw) => profile.jobCategory.toLowerCase().includes(kw));
  }

  if (profile.jobType) {
    const text = profile.jobType.toLowerCase();
    const matched = Object.entries(JOB_TYPE_ROLE_KEYWORDS)
      .filter(([, kws]) => kws.some((kw) => text.includes(kw)))
      .map(([cat]) => cat);
    if (matched.length === 1) return matched[0] === jobType;
    // 0 matches (e.g. "Human Resources") or ambiguous (e.g. "Account Executive") → trust API
  }

  return true;
}

const LANGUAGE_API_NAMES = {
  "Malay": "bahasa malaysia",
  "English": "english",
  "Mandarin": "mandarin",
  "Tamil": "tamil",
};

// Returns true if a profile language string fuzzy-matches a UI filter label.
// Handles case differences, "bahasa malaysia" ↔ "Malay" via LANGUAGE_API_NAMES,
// and any substring containment in either direction.
function languageMatches(profileLang, filterLang) {
  const p = profileLang.toLowerCase().trim();
  const f = filterLang.toLowerCase().trim();
  if (p === f || p.includes(f) || f.includes(p)) return true;
  const alias = (LANGUAGE_API_NAMES[filterLang] || "").toLowerCase();
  return !!alias && (p === alias || p.includes(alias) || alias.includes(p));
}

// --- Availability label normalisation ---

const AVAILABILITY_LABELS = {
  "immediately": "Immediate",
  "immediate": "Immediate",
  "asap": "Immediate",
  "1 week": "1 week",
  "1 weeks": "1 week",
  "2 weeks": "2 weeks",
  "two weeks": "2 weeks",
  "2 weeks notice": "2 weeks",
  "1 month": "1 month",
  "one month": "1 month",
  "1 month notice": "1 month",
  "2 months": "2 months",
  "two months": "2 months",
  "3 months": "3 months",
  "three months": "3 months",
  "negotiable": "Negotiable",
  "flexible": "Flexible",
  "other values": "Flexible",
  "others": "Flexible",
  "other": "Flexible",
  "open": "Open to discuss",
};

function normalizeAvailability(raw) {
  if (!raw) return "";
  const key = raw.trim().toLowerCase();
  return AVAILABILITY_LABELS[key] || raw;
}

// --- Business scoring rules ---

const EDUCATION_SCORES = {
  "phd": 100, "doctorate": 100,
  "master": 85, "mba": 85,
  "degree": 70, "bachelor": 70, "honours": 70, "honor": 70,
  "professional": 65, "acca": 65, "cpa": 65, "cima": 65,
  "diploma": 45, "advanced diploma": 55,
  "stpm": 30,
  "spm": 20, "certificate": 25,
};

// Well-known large Malaysian and regional companies get a prestige bonus
const LARGE_COMPANY_KEYWORDS = [
  "petronas", "maybank", "cimb", "axiata", "maxis", "celcom", "digi", "telekom", "unifi",
  "airasia", "malaysia airlines", "genting", "sime darby", "public bank", "hong leong",
  "rhb", "ambank", "tenaga", "tnb", "khazanah", "kwsp", "epf", "socso",
  "shopee", "lazada", "grab", "foodpanda", "boost", "touch n go",
  "shell", "exxon", "basf", "henkel",
  "deloitte", "kpmg", "pwc", "ernst & young", "mckinsey", "accenture", "ibm",
  "top glove", "hartalega", "supermax", "kossan",
  "nestle", "unilever", "procter", "p&g", "coca-cola", "pepsi",
  "samsung", "intel", "dell", "hp", "oracle", "microsoft", "google", "amazon",
  "dhl", "fedex", "ups", "gdex", "pos malaysia",
  "aeon", "parkson", "mydin",
  "mcdonald", "kfc", "starbucks", "pizza hut",
];

function scoreExperience(yearOfExperienceInMonth) {
  const months = Number(yearOfExperienceInMonth) || 0;
  const years = months / 12;
  if (years >= 10) return 100;
  if (years >= 7)  return 85;
  if (years >= 5)  return 70;
  if (years >= 3)  return 50;
  if (years >= 2)  return 35;
  if (years >= 1)  return 20;
  return 5;
}

function scoreEducation(educationStr) {
  if (!educationStr) return 0;
  const lower = (typeof educationStr === "string" ? educationStr : JSON.stringify(educationStr)).toLowerCase();
  for (const [keyword, score] of Object.entries(EDUCATION_SCORES)) {
    if (lower.includes(keyword)) return score;
  }
  return 10;
}

function scoreCompany(workExperiences) {
  if (!Array.isArray(workExperiences) || workExperiences.length === 0) return 0;
  let best = 0;
  for (const exp of workExperiences) {
    const company = (exp.jobCompany || exp.companyName || exp.company || exp.employer || exp.name || exp.organizationName || exp.organization || "").toLowerCase();
    if (!company) continue;
    if (LARGE_COMPANY_KEYWORDS.some((kw) => company.includes(kw))) { best = Math.max(best, 100); break; }
    if (company.includes(" berhad") || company.endsWith(" bhd"))     best = Math.max(best, 65);
    else if (company.includes("sdn bhd"))                            best = Math.max(best, 40);
    else                                                             best = Math.max(best, 15);
  }
  return best;
}

function computeBusinessScore(raw, education) {
  const expMonths = raw.yearOfExperienceInMonth ?? raw.monthOfExperience ?? raw.yearsOfExperienceInMonth ?? null;
  const expScore        = scoreExperience(expMonths);
  const eduScore        = scoreEducation(education);
  const coScore         = scoreCompany(raw.workExperiences);
  const completeness    = Math.min(100, Math.max(0, Number(raw.completeness) || 0));
  // Weights: company 40%, education 30%, experience 20%, completeness 10%
  return Math.round(coScore * 0.40 + eduScore * 0.30 + expScore * 0.20 + completeness * 0.10);
}

// --- End business scoring rules ---

function splitToHighlights(text) {
  if (!text) return [];
  return text
    .split(/[.!?]\s+|\n+/)
    .map((s) => s.trim().replace(/^[-•·*]\s*/, "").trim())
    .filter((s) => s.length > 15)
    .slice(0, 4);
}

function stripPii(text) {
  if (typeof text !== "string" || !text) return text;
  return text
    // Malaysian mobile: +60 12-3456789, 012-345 6789, 0123456789, +6012-3456789
    .replace(/(\+?60[\s\-]?1[0-9][\s\-]?\d{3,4}[\s\-]?\d{4}|\b01[0-9][\s\-]?\d{3,4}[\s\-]?\d{4})/g, "[contact redacted]")
    // Malaysian landline: 03-12345678, 04 1234567
    .replace(/\b0[3-9][\s\-]?\d{3,4}[\s\-]?\d{4}\b/g, "[contact redacted]")
    // Email addresses
    .replace(/\b[\w.+\-]+@[\w\-]+\.[a-z]{2,}\b/gi, "[contact redacted]")
    // Malaysian NRIC: 850101-14-1234 or 850101141234
    .replace(/\b\d{6}[\-]?\d{2}[\-]?\d{4}\b/g, "[ID redacted]");
}

function normalizeApiProfile(raw) {
  const latestPosition = raw.latest_job_position_and_company || "";
  const roleFromPosition = latestPosition.split(" at ")[0] || latestPosition;
  const availability = raw.availability || "";
  const yoe = raw.years_of_experience;
  const experienceStr = typeof yoe === "number"
    ? `${yoe} year${yoe !== 1 ? "s" : ""}`
    : String(yoe || "");
  const summary = stripPii(raw.resume_summary || "");
  const urgencyPrefix = availability.toLowerCase() === "immediate" ? "Actively looking" : "Open to offers";
  return {
    id: raw.candidate_id || `live-${Math.random().toString(36).slice(2, 9)}`,
    name: raw.masked_name || "—",
    role: roleFromPosition,
    jobCategory: raw.interest_job_category || "",
    jobType: raw.interest_job_category || "",
    latestPosition,
    industry: raw.interest_job_category || "",
    careerSnapshot: summary,
    urgency: availability ? `${urgencyPrefix} · ${availability.toLowerCase()} availability` : "",
    location: raw.location || "",
    experience: experienceStr,
    availability,
    education: raw.education || "",
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    workPreference: "",
    commute: "",
    qualitySignals: summary ? [summary] : [],
    match: 0,
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    maskedPhone: "",
    maskedEmail: "",
  };
}

function normalizeCandidateSearchProfile(raw) {
  // Latest work experience → "Job Title at Company"
  const experiences = Array.isArray(raw.workExperiences) ? raw.workExperiences : [];
  // Sort to get most recent first — null/empty end date means currently employed
  const sortedExp = [...experiences].sort((a, b) => {
    const aEnd = a.endDate || a.dateTo || a.end || a.to || "";
    const bEnd = b.endDate || b.dateTo || b.end || b.to || "";
    if (!aEnd && !bEnd) return 0;
    if (!aEnd) return -1;
    if (!bEnd) return 1;
    return new Date(bEnd) - new Date(aEnd);
  });
  const latestExp = sortedExp[0] || {};
  const expJobTitle = raw.currentJobTitle || latestExp.jobTitle || latestExp.title || latestExp.position || "";
  const expCompany = raw.currentCompany || raw.currentEmployer || raw.company ||
    latestExp.jobCompany || latestExp.companyName || latestExp.company ||
    latestExp.employer || latestExp.organizationName || latestExp.organization || latestExp.name || "";
  const builtPosition = expJobTitle && expCompany
    ? `${expJobTitle} at ${expCompany}`
    : expJobTitle || expCompany || "";
  const latestPosition = raw.latest_job_position_and_company || builtPosition;
  // Extract role from the "Title at Company" string if camelCase fields were empty
  const roleFromPosition = !expJobTitle && latestPosition ? latestPosition.split(" at ")[0].trim() : "";

  // Skills — personalSkills (camelCase apps) or skills (snake_case apps like insightsprod)
  const rawSkills = Array.isArray(raw.personalSkills) ? raw.personalSkills
    : Array.isArray(raw.skills) ? raw.skills : [];
  const skills = rawSkills
    .map((s) => (typeof s === "string" ? s : s.skill || s.name || s.label || ""))
    .filter(Boolean);

  // Languages — languageRatings is [{language, rating}], languages may be plain strings
  const rawLangs = Array.isArray(raw.languageRatings) && raw.languageRatings.length > 0
    ? raw.languageRatings
    : (Array.isArray(raw.languages) ? raw.languages : []);
  const languages = rawLangs
    .map((l) => (typeof l === "string" ? l : l.language || l.name || l.lang || ""))
    .filter(Boolean);

  // Experience — try direct years first, then convert from months.
  // Use Number() coercion because some app sources serialize these as strings.
  // totalExperienceInMonths mirrors the indexed field implied by the minTotalExperienceInMonths filter.
  const yoeDirectRaw = raw.years_of_experience ?? raw.yearsOfExperience ?? null;
  const yoeMonthsRaw = raw.yearOfExperienceInMonth ?? raw.totalExperienceInMonths ?? raw.monthOfExperience ?? raw.yearsOfExperienceInMonth ?? null;
  const yoeDirect = yoeDirectRaw !== null ? Number(yoeDirectRaw) : null;
  const yoeMonths = yoeMonthsRaw !== null ? Number(yoeMonthsRaw) : null;
  const yoeYears = (yoeDirect !== null && !isNaN(yoeDirect)) ? Math.round(yoeDirect)
    : (yoeMonths !== null && !isNaN(yoeMonths)) ? Math.floor(yoeMonths / 12) : null;
  const experienceStr = yoeYears !== null ? `${yoeYears} year${yoeYears !== 1 ? "s" : ""}` : "";

  // Availability — some sources return an opaque enum code in `availability` (e.g. "availability_4")
  // while `availability_synonym` carries the human-readable equivalent. Try each source in order,
  // skipping any value that looks like a bare enum code, so the synonym wins when `availability` is coded.
  const availabilitySources = [
    raw.availability_synonym,
    raw.availability,
    raw.noticePeriod,
    raw.notice_period,
    raw.availabilityPeriod,
    raw.availabilityStatus,
  ];
  const isEnumCode = (v) => /^[a-z_]+_\d+$/i.test(String(v).trim());
  const resolvedAvRaw = availabilitySources.find((v) => v && !isEnumCode(v))
    ?? availabilitySources.find(Boolean)
    ?? "";
  if (!resolvedAvRaw && process.env.NODE_ENV !== "production") {
    const avKeys = Object.keys(raw).filter((k) => k.toLowerCase().includes("avail") || k.toLowerCase().includes("notice"));
    if (avKeys.length) console.warn("[availability] unrecognised fields:", Object.fromEntries(avKeys.map((k) => [k, raw[k]])));
  }
  const availability = normalizeAvailability(resolvedAvRaw);
  const urgencyPrefix = availability.toLowerCase().includes("immediate") ? "Actively looking" : "Open to offers";

  // Education — build from all entries; keep a single string for scoring
  const formatEduEntry = (e) => {
    if (typeof e === "string") return e;
    const q = e.qualification || e.level || e.qualificationName || "";
    const c = e.course || e.fieldOfStudy || e.field_of_study || e.major || "";
    const s = e.school || e.instituteName || e.institute || e.institution
      || e.schoolName || e.universityName || e.collegeName || e.college || "";
    const startYear = e.startDate ? String(e.startDate).slice(0, 4) : "";
    const endYear = e.endDate ? String(e.endDate).slice(0, 4) : "";
    const yearRange = startYear ? `(${startYear} – ${endYear})` : "";
    return [[q, c, s].filter(Boolean).join(", "), yearRange].filter(Boolean).join(" ");
  };
  const allEduRaw = Array.isArray(raw.educations) && raw.educations.length > 0
    ? raw.educations
    : raw.lastestEducation ? [raw.lastestEducation]
    : raw.education ? [raw.education]
    : [];
  const educations = allEduRaw.map(formatEduEntry).filter(Boolean);
  const education = educations[0] || "";

  // Career snapshot — strip PII from free text
  const summary = stripPii(raw.personalDescription || raw.currentJobDescription || raw.resume_summary || "");

  // Location — API returns an object {city, state, ...}, not a plain string
  const rawLoc = raw.location;
  const locationStr = rawLoc && typeof rawLoc === "object"
    ? [rawLoc.city, rawLoc.state].filter(Boolean).join(", ")
    : (typeof rawLoc === "string" ? rawLoc : "");

  // Preferred work location for commute hint — also an object
  const rawPrefLoc = raw.preferredWorkLocation;
  const preferredLocs = rawPrefLoc && typeof rawPrefLoc === "object"
    ? [rawPrefLoc.city, rawPrefLoc.state].filter(Boolean).join(", ")
    : Array.isArray(rawPrefLoc) ? rawPrefLoc.join(", ") : "";

  // Application count
  const applicationCount = Array.isArray(raw.applications) ? raw.applications.length : 0;

  // Name — prefer shadow masked name; fall back to generating initials from raw.name
  const shadow = raw.shadow || {};
  const maskedName = shadow.maskedName || shadow.masked_name || shadow.name || raw.masked_name ||
    (raw.name ? raw.name.split(/\s+/).map((w) => w[0]?.toUpperCase()).filter(Boolean).join(".") + "." : "—");

  return {
    id: raw.docId || raw.candidate_id || `live-${Math.random().toString(36).slice(2, 9)}`,
    name: maskedName,
    role: expJobTitle || roleFromPosition,
    jobCategory: raw.interest_job_category || "",
    jobType: raw.interest_job_category || raw.preferredJobTitle || expJobTitle || roleFromPosition || "",
    latestPosition,
    industry: raw.interest_job_category || raw.preferredJobTitle || expJobTitle || roleFromPosition || "",
    careerSnapshot: summary,
    urgency: availability ? `${urgencyPrefix} · ${availability.toLowerCase()} availability` : "",
    location: locationStr,
    experience: experienceStr,
    availability,
    education,
    educations,
    preferredJobTitle: raw.preferredJobTitle || raw.interest_job_category || "",
    languages,
    workPreference: raw.isRemote ? "Remote / flexible" : "",
    commute: preferredLocs,
    qualitySignals: splitToHighlights(summary),
    match: computeBusinessScore(raw, education),
    skills,
    applicationCount,
    isOpenToWork: raw.isOpenToWork !== false,
    maskedPhone: "",
    maskedEmail: "",
  };
}

// Session-level cache so switching job types and back doesn't re-fetch
const profileCache = new Map();

function profileCacheKey({ jobType, location, languages, titleQuery = "" }) {
  return `${titleQuery}|${jobType}|${location}|${[...languages].sort().join(",")}`;
}

async function fetchAllLiveProfiles(query) {
  const key = profileCacheKey(query);
  if (profileCache.has(key)) return profileCache.get(key);

  const MAX_PAGES = 3;
  let allProfiles = [];
  let from = 0;
  let dbTotal = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const { profiles, nextFrom, dbTotal: total } = await fetchLiveProfiles(query, from);
    allProfiles = allProfiles.concat(profiles);
    if (dbTotal === null) dbTotal = total;
    if (!nextFrom) break;
    from = nextFrom;
  }

  // Deduplicate across pages
  const seen = new Set();
  const unique = allProfiles.filter((p) => {
    const k = p.name + "|" + p.latestPosition + "|" + p.experience;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  profileCache.set(key, unique);
  return unique;
}

async function fetchLiveProfiles({ jobType, location, languages, titleQuery = "" }, from = 0) {
  const searchTerm = titleQuery || JOB_TYPE_TO_TITLE[jobType] || jobType.toLowerCase();
  const body = {
    size: 500,
    from,
    sorting: "lastActiveDate",
    ordering: "desc",
    terms: [searchTerm],
    jobTitleBooleanFilters: [
      { title: searchTerm, keywordPriority: "must_have", experiencePreference: "current" },
    ],
    ...(location ? { city: [location] } : {}),
    ...(languages.length > 0 ? {
      languageBooleanFilters: languages.map((lang) => ({
        languages: [LANGUAGE_API_NAMES[lang] || lang.toLowerCase()],
        keywordPriority: "must_have",
      })),
    } : {}),
    app: ["maukerjaprod", "ricebowlprod", "public"],
  };
  const res = await fetch("/api/search", {
    method: "POST",
    headers: PROXY_HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API ${res.status}`);
  }
  const data = await res.json();
  const rawList = data.hits || data.candidates || data.profiles || data.data || data.results || [];
  // data.total is the unfiltered DB size — use rawList.length as the actual matched count
  const dbTotal = data.total ?? data.totalHits ?? rawList.length;
  const nextFrom = from + rawList.length < dbTotal ? from + rawList.length : null;
  const profiles = rawList.map(normalizeCandidateSearchProfile);
  const seen = new Set();
  const unique = profiles.filter((p) => {
    const key = p.name + "|" + p.latestPosition + "|" + p.experience;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { profiles: unique, nextFrom, dbTotal };
}

const malaysianLocations = [
  "Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Subang Jaya", "Klang",
  "Cheras", "Ampang", "Bangsar", "Bangsar South", "Puchong", "Cyberjaya",
  "Putrajaya", "Sepang", "Kajang", "Selayang", "Rawang", "Kepong",
  "Georgetown", "Butterworth", "Bayan Lepas", "Seberang Perai",
  "Johor Bahru", "Iskandar Puteri", "Batu Pahat", "Muar",
  "Ipoh", "Taiping", "Teluk Intan",
  "Kota Kinabalu", "Sandakan", "Tawau",
  "Kuching", "Miri", "Sibu",
  "Seremban", "Melaka City", "Alor Setar", "Kota Bharu",
  "Kuala Terengganu", "Kuantan", "Port Klang", "Bestari Jaya",
];

const platformDefaults = [
  {
    platform: "Maukerja",
    benefit: "Local mass-market reach; strong for non-executive, frontline, retail, F&B, admin, sales, and operations roles.",
    use: "Volume hiring and fast Malaysian candidate reach.",
    weight: 95,
  },
  {
    platform: "Ricebowl",
    benefit: "Chinese-speaking and bilingual talent reach; useful for SME roles requiring Mandarin or local sales/admin coverage.",
    use: "Mandarin/bilingual roles and SME hiring.",
    weight: 90,
  },
  {
    platform: "EpiCareer",
    benefit: "Additional job distribution and discovery surface; helps widen job exposure beyond one job board.",
    use: "Incremental reach and long-tail job discovery.",
    weight: 68,
  },
  {
    platform: "LinkedIn",
    benefit: "Professional network reach; stronger for white-collar, specialist, manager, and corporate roles.",
    use: "Professional hiring and employer branding.",
    weight: 78,
  },
  {
    platform: "Google",
    benefit: "Search discovery layer; captures jobseekers searching directly for role, location, and company keywords.",
    use: "Intent-based candidate discovery.",
    weight: 74,
  },
  {
    platform: "Facebook",
    benefit: "Community and social reach; useful for local hiring, walk-in style roles, and quick awareness.",
    use: "Local awareness and retargeting-style reach.",
    weight: 72,
  },
];

const competitorDefaults = [
  { name: "AJobThing Package", price: 688, coverage: 6, support: "Included", guarantee: "Yes" },
  { name: "JobStreet / SEEK", price: 980, coverage: 1, support: "Platform support", guarantee: "No public guarantee" },
  { name: "LinkedIn promoted job", price: 850, coverage: 1, support: "Self-serve", guarantee: "No public guarantee" },
  { name: "Indeed sponsored job", price: 650, coverage: 1, support: "Self-serve", guarantee: "No public guarantee" },
];

const tabs = [
  { id: "profiles", label: "Candidate proof" },
  // { id: "winning", label: "AJT winning points" },
  // { id: "pricing", label: "Price comparison" },
  // { id: "platforms", label: "6-platform story" },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#020617",
    padding: 24,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: { maxWidth: 1280, margin: "0 auto", display: "grid", gap: 24 },
  heroGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)", gap: 16 },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)" },
  cardPad: { padding: 24 },
  badge: { display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, background: "#0f172a", color: "#fff" },
  badgeLight: { display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, background: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "10px 12px", fontSize: 14, background: "#fff", boxSizing: "border-box" },
  label: { display: "block", marginBottom: 6, color: "#64748b", fontSize: 12, fontWeight: 700 },
  title: { margin: 0, fontSize: 32, lineHeight: 1.15, fontWeight: 800, letterSpacing: -0.5 },
  subtitle: { margin: "8px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.65 },
  small: { color: "#64748b", fontSize: 13, lineHeight: 1.6 },
  tabList: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, padding: 6, background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0" },
  tab: { border: 0, borderRadius: 14, padding: "10px 8px", fontWeight: 700, cursor: "pointer", fontSize: 13 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 },
  mutedBox: { borderRadius: 18, background: "#f1f5f9", padding: 16 },
  darkBox: { borderRadius: 20, background: "#0f172a", color: "#fff", padding: 18 },
  button: { border: 0, borderRadius: 16, padding: "10px 16px", background: "#0f172a", color: "#fff", fontWeight: 800, cursor: "pointer" },
};

function currency(n) {
  return `RM${Number(n || 0).toLocaleString("en-MY")}`;
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Compiled once at module scope to avoid recreation on every render
const TEST_PATTERN = /\b(dummy|sample|fake|trial|test)\b/i;
function isTestProfile(p) {
  return (
    TEST_PATTERN.test(p.name) ||
    TEST_PATTERN.test(p.latestPosition) ||
    TEST_PATTERN.test(p.careerSnapshot || "") ||
    TEST_PATTERN.test(p.industry || "") ||
    TEST_PATTERN.test(p.education || "") ||
    TEST_PATTERN.test(p.urgency || "") ||
    (p.skills || []).some((s) => TEST_PATTERN.test(s)) ||
    (p.qualitySignals || []).some((s) => TEST_PATTERN.test(s))
  );
}

function isOpenToWork(p) {
  const av = (p.availability || "").trim();
  return av.length > 0 && av !== "—";
}

// Scores how relevant a candidate is to the search title across three signals:
// current job (strongest), desired job (medium), skills (lightest).
// Returns 0 when no search title is given or when no signal matches.
function computeRelevanceScore(p, searchTitle) {
  if (!searchTitle) return 0;
  const needle = searchTitle.toLowerCase().trim();
  if (!needle) return 0;
  const words = needle.split(/\s+/).filter((w) => w.length > 2);
  if (!words.length) return 0;

  const currentJob = ((p.role || "") + " " + (p.latestPosition || "")).toLowerCase();
  const desiredJob = ((p.preferredJobTitle || "") + " " + (p.jobCategory || "") + " " + (p.jobType || "")).toLowerCase();
  const skillsText = (p.skills || []).join(" ").toLowerCase();

  const wordFrac = (text) => words.filter((w) => text.includes(w)).length / words.length;

  // Exact phrase hit scores highest; word-level overlap is a fallback
  const currentScore = Math.max(currentJob.includes(needle) ? 100 : 0, Math.round(wordFrac(currentJob) * 60));
  const desiredScore = Math.max(desiredJob.includes(needle) ? 75 : 0, Math.round(wordFrac(desiredJob) * 40));
  const skillsScore  = Math.round(wordFrac(skillsText) * 20);

  return currentScore + desiredScore + skillsScore;
}

const PROXY_SECRET = import.meta.env.VITE_PROXY_SECRET || "";
const PROXY_HEADERS = {
  "Content-Type": "application/json",
  ...(PROXY_SECRET ? { Authorization: `Bearer ${PROXY_SECRET}` } : {}),
};

function calculateCostPerPlatform(price, coverage) {
  return safeNumber(price) / Math.max(1, safeNumber(coverage, 1));
}

function calculateSavings(rows) {
  if (!rows || rows.length <= 1) return 0;
  const ajt = safeNumber(rows[0]?.price);
  const competitorsOnly = rows.slice(1);
  const avgCompetitor = competitorsOnly.reduce((sum, c) => sum + safeNumber(c.price), 0) / Math.max(1, competitorsOnly.length);
  return Math.round(avgCompetitor - ajt);
}

function getGuaranteeMessage(applicantCount) {
  return safeNumber(applicantCount) <= 10 ? "Guarantee risk zone: offer free job ad fallback." : "Above guarantee threshold: focus on quality and speed.";
}

function runCatalogueTests() {
  const tests = [
    { name: "cost per platform uses coverage", pass: calculateCostPerPlatform(600, 6) === 100 },
    { name: "cost per platform guards zero coverage", pass: calculateCostPerPlatform(600, 0) === 600 },
    { name: "cost per platform guards non-numeric coverage", pass: calculateCostPerPlatform(600, "abc") === 600 },
    { name: "savings compares AJT against competitor average", pass: calculateSavings([{ price: 600 }, { price: 900 }, { price: 1100 }]) === 400 },
    { name: "savings returns zero when there are no competitors", pass: calculateSavings([{ price: 600 }]) === 0 },
    { name: "profile pool covers all eight job types", pass: JOB_TYPES.every((t) => profilePool.some((p) => p.jobType === t)) },
    { name: "candidate private phone data is masked", pass: profilePool.every((p) => p.maskedPhone.includes("XXX")) },
    { name: "candidate private email data is masked", pass: profilePool.every((p) => p.maskedEmail.includes("***")) },
    { name: "candidate profiles include latest position and company", pass: profilePool.every((p) => p.latestPosition && p.latestPosition.includes(" at ")) },
    { name: "candidate profiles no longer expose expected salary", pass: profilePool.every((p) => !Object.prototype.hasOwnProperty.call(p, "salary")) },
    { name: "candidate profiles include career highlights", pass: profilePool.every((p) => Array.isArray(p.qualitySignals) && p.qualitySignals.length >= 3) },
    { name: "candidate profiles include language data", pass: profilePool.every((p) => Array.isArray(p.languages) && p.languages.length >= 2) },
    { name: "candidate profiles include industry classification", pass: profilePool.every((p) => typeof p.industry === "string" && p.industry.length > 0) },
    { name: "candidate profiles include career snapshot", pass: profilePool.every((p) => typeof p.careerSnapshot === "string" && p.careerSnapshot.length > 0) },
    { name: "candidate profiles include urgency signal", pass: profilePool.every((p) => typeof p.urgency === "string" && p.urgency.length > 0) },
    { name: "candidate career highlights contain quantified achievements", pass: profilePool.every((p) => p.qualitySignals.some((s) => /\d/.test(s))) },
    { name: "platform story covers six platforms", pass: platformDefaults.length === 6 },
    { name: "call script tab removed", pass: tabs.every((tab) => tab.id !== "script") },
    { name: "guarantee triggers at 10 applicants", pass: getGuaranteeMessage(10).includes("Guarantee risk zone") },
    { name: "guarantee does not trigger above 10 applicants", pass: getGuaranteeMessage(11).includes("Above guarantee threshold") },
    { name: "normalizeApiProfile maps required API fields to internal shape", pass: (() => { const p = normalizeApiProfile({ masked_name: "T.E.", latest_job_position_and_company: "Engineer at Acme", location: "KL", interest_job_category: "Engineering", years_of_experience: 3, availability: "Immediate", education: "Degree", languages: ["English"], skills: ["React"], resume_summary: "Good engineer.", candidate_id: "API-001" }); return p.name === "T.E." && p.latestPosition === "Engineer at Acme" && p.experience === "3 years" && p.id === "API-001" && p.qualitySignals.length === 1; })() },
    { name: "normalizeApiProfile handles missing optional fields gracefully", pass: (() => { const p = normalizeApiProfile({ latest_job_position_and_company: "Exec at Co", interest_job_category: "Sales" }); return p.name === "—" && p.id.startsWith("live-") && Array.isArray(p.languages) && p.qualitySignals.length === 0; })() },
    { name: "stripPii redacts Malaysian mobile phone numbers", pass: stripPii("Call 012-3456789 or +60123456789") === "Call [contact redacted] or [contact redacted]" },
    { name: "stripPii redacts email addresses", pass: stripPii("Reach me at john.doe@gmail.com thanks") === "Reach me at [contact redacted] thanks" },
    { name: "stripPii redacts Malaysian NRIC numbers", pass: stripPii("My IC is 850101-14-1234.") === "My IC is [ID redacted]." },
    { name: "stripPii leaves non-PII text unchanged", pass: stripPii("Managed a team of 15 at Lazada, improved SLA by 20%.") === "Managed a team of 15 at Lazada, improved SLA by 20%." },
    { name: "normalizeCandidateSearchProfile never exposes unmasked name even if raw.name is present", pass: (() => { const p = normalizeCandidateSearchProfile({ name: "John Doe Smith", candidateId: "X-001" }); return p.name === "—"; })() },
    { name: "normalizeCandidateSearchProfile strips contact info from careerSnapshot", pass: (() => { const p = normalizeCandidateSearchProfile({ masked_name: "J.D.", resume_summary: "Reach me at john@example.com or 012-3456789", interest_job_category: "Sales" }); return !p.careerSnapshot.includes("@") && !p.careerSnapshot.includes("012") && !p.qualitySignals.some((s) => s.includes("@")); })() },
    { name: "normalizeApiProfile strips contact info from careerSnapshot", pass: (() => { const p = normalizeApiProfile({ masked_name: "A.B.", latest_job_position_and_company: "Exec at Co", interest_job_category: "Sales", resume_summary: "Contact: 03-12345678 or ab@work.com" }); return !p.careerSnapshot.includes("03-") && !p.careerSnapshot.includes("@"); })() },
    { name: "normalizeCandidateSearchProfile maps snake_case search service fields", pass: (() => { const p = normalizeCandidateSearchProfile({ candidate_id: "S-001", masked_name: "J.D.", latest_job_position_and_company: "Sales Exec at Telco", location: "Kuala Lumpur", interest_job_category: "Sales", years_of_experience: 4, availability: "Immediate", education: "Degree", languages: ["English", "Mandarin"], skills: ["B2B"], resume_summary: "Top performer.", score: 88 }); return p.id === "S-001" && p.name === "J.D." && p.latestPosition === "Sales Exec at Telco" && p.experience === "4 years" && p.match === 88 && p.languages.length === 2; })() },
    { name: "normalizeCandidateSearchProfile maps camelCase search service fields", pass: (() => { const p = normalizeCandidateSearchProfile({ candidateId: "S-002", maskedName: "A.B.", currentJobTitle: "Accountant", currentCompany: "Maybank", city: "Petaling Jaya", jobCategory: "Accounting", yearsOfExperience: 2, availability: "2 weeks", resumeSummary: "Detail-oriented.", languages: ["English"], skills: [] }); return p.id === "S-002" && p.name === "A.B." && p.latestPosition === "Accountant at Maybank" && p.location === "Petaling Jaya" && p.experience === "2 years"; })() },
    { name: "normalizeCandidateSearchProfile handles empty/missing fields gracefully", pass: (() => { const p = normalizeCandidateSearchProfile({}); return p.name === "—" && p.id.startsWith("live-") && Array.isArray(p.languages) && Array.isArray(p.skills) && p.qualitySignals.length === 0 && p.match === 0; })() },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    total: tests.length,
    tests,
  };
}

function Card({ children, style }) {
  return <div style={{ ...styles.card, ...style }}>{children}</div>;
}

function Badge({ children, light = false }) {
  return <span style={light ? styles.badgeLight : styles.badge}>{children}</span>;
}

function TextInput({ value, onChange, type = "text", style, placeholder }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{ ...styles.input, ...style }} placeholder={placeholder} />;
}

function ScoreBar({ value }) {
  const normalized = Math.min(100, Math.max(0, safeNumber(value)));
  return (
    <div style={{ height: 8, width: "100%", borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${normalized}%`, borderRadius: 999, background: "#0f172a" }} />
    </div>
  );
}

function Icon({ name, size = 24 }) {
  const icons = {
    shield: "🛡",
    check: "✓",
    megaphone: "📣",
    users: "👥",
    calculator: "▣",
    eyeOff: "◌",
    sparkles: "✦",
    globe: "◎",
    share: "↗",
  };
  return (
    <span
      aria-hidden="true"
      style={{ display: "inline-flex", width: size, height: size, alignItems: "center", justifyContent: "center", fontSize: Math.max(14, size - 4) }}
    >
      {icons[name] || "•"}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function LocationSelector({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const matches = query.trim()
    ? malaysianLocations.filter((l) => l.toLowerCase().includes(query.toLowerCase()))
    : malaysianLocations;
  function select(loc) { setQuery(loc); onChange(loc); }
  function clear() { setQuery(""); onChange(""); }
  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type to search location…"
        style={{ ...styles.input }}
      />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, zIndex: 200, maxHeight: 200, overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          {query && (
            <button type="button" onMouseDown={clear} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: 0, borderBottom: "1px solid #f1f5f9", background: "#f8fafc", cursor: "pointer", fontSize: 12, color: "#64748b", fontWeight: 700 }}>
              Clear
            </button>
          )}
          {matches.map((loc) => (
            <button key={loc} type="button" onMouseDown={() => select(loc)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: 0, borderTop: "1px solid #f1f5f9", background: "none", cursor: "pointer", fontSize: 13, color: "#0f172a" }}>
              {loc}
            </button>
          ))}
          {matches.length === 0 && <div style={{ padding: "8px 12px", fontSize: 13, color: "#94a3b8" }}>No locations found</div>}
        </div>
      )}
    </div>
  );
}

function ResponsiveNote() {
  return (
    <style>{`
      @media (max-width: 980px) {
        .ajt-hero-grid, .ajt-grid-3, .ajt-grid-2, .ajt-simulator-grid { grid-template-columns: 1fr !important; }
        .ajt-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .ajt-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      }
      @media (max-width: 640px) {
        .ajt-form-grid, .ajt-tabs { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

export default function AJTInteractiveSalesCatalogue() {
  const [activeTab, setActiveTab] = useState("profiles");
  const [customerName, setCustomerName] = useState("ABC Retail Sdn Bhd");
  const [jobTitle, setJobTitle] = useState("Sales Executive");
  const [hiringNeed, setHiringNeed] = useState("Fast replacement hiring");
  const [ajtPrice, setAjtPrice] = useState(688);
  const [targetApplicants, setTargetApplicants] = useState(30);
  const [pool, setPool] = useState([]);
  const [competitors, setCompetitors] = useState(competitorDefaults);

  const [locationFilter, setLocationFilter] = useState("");
  const [requiredLanguages, setRequiredLanguages] = useState([]);
  const [shared, setShared] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLiveData, setIsLiveData] = useState(false);
  const [summaries, setSummaries] = useState({});
  const [summariesLoading, setSummariesLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [titleQuery, setTitleQuery] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [selectedProfileIds, setSelectedProfileIds] = useState(new Set());
  const [expandedSkills, setExpandedSkills] = useState(new Set());
  const profileCardsRef = useRef(null);

  const testResult = useMemo(() => runCatalogueTests(), []);

  // Debounce the title search so we don't fire on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTitle(titleQuery.trim()), 500);
    return () => clearTimeout(t);
  }, [titleQuery]);

  useEffect(() => {
    if (!debouncedTitle) {
      setPool([]);
      setIsLiveData(false);
      setApiLoading(false);
      setApiError(null);
      return;
    }
    let cancelled = false;
    setApiLoading(true);
    setApiError(null);
    setPool([]);
    setShowAll(false);
    const query = { jobType: "", location: locationFilter, languages: requiredLanguages, titleQuery: debouncedTitle };
    fetchAllLiveProfiles(query)
      .then((profiles) => {
        if (cancelled) return;
        if (profiles.length > 0) {
          setPool(profiles);
          setIsLiveData(true);
        } else {
          setPool([]);
          setIsLiveData(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setApiError(err.message);
        setPool([]);
        setIsLiveData(false);
      })
      .finally(() => { if (!cancelled) setApiLoading(false); });
    return () => { cancelled = true; };
  }, [locationFilter, requiredLanguages, debouncedTitle, refreshKey]);

  const eligibleProfiles = useMemo(() => {
    // Attach relevance score to each profile once so filter and sort share it
    const withRelevance = pool.map((p) => ({ ...p, relevanceScore: computeRelevanceScore(p, debouncedTitle) }));

    const passesRelevance = (p) => {
      if (!debouncedTitle) return true;
      // Candidates with no data in any signal are let through to avoid false exclusions
      const hasSignal = p.latestPosition || p.role || p.preferredJobTitle || p.jobCategory || (p.skills || []).length > 0;
      return !hasSignal || p.relevanceScore > 0;
    };

    const sortByRelevanceThenQuality = (a, b) => b.relevanceScore - a.relevanceScore || b.match - a.match;

    if (isLiveData) {
      return withRelevance
        .filter((p) => {
          if (isTestProfile(p)) return false;
          if (!passesRelevance(p)) return false;
          if (requiredLanguages.length > 0 && !requiredLanguages.every((lang) => p.languages.some((pl) => languageMatches(pl, lang)))) return false;
          // Drop only truly empty profiles — no position, no snapshot, no skills, no languages, and no experience
          if (!p.latestPosition && !p.careerSnapshot && p.skills.length === 0 && p.languages.length === 0 && !p.experience) return false;
          return true;
        })
        .sort(sortByRelevanceThenQuality);
    }
    let result = withRelevance.filter((p) => !isTestProfile(p) && passesRelevance(p));
    if (locationFilter.trim()) {
      result = result.filter((p) => p.location.toLowerCase().includes(locationFilter.toLowerCase().trim()));
    }
    if (requiredLanguages.length > 0) {
      result = result.filter((p) => requiredLanguages.every((lang) => p.languages.some((pl) => languageMatches(pl, lang))));
    }
    return [...result].sort(sortByRelevanceThenQuality);
  }, [pool, isLiveData, locationFilter, requiredLanguages, debouncedTitle]);

  const INITIAL_SHOW = 9;
  const displayedProfiles = useMemo(
    () => showAll ? eligibleProfiles : eligibleProfiles.slice(0, INITIAL_SHOW),
    [eligibleProfiles, showAll]
  );

  // Default: all displayed profiles are selected for sharing
  useEffect(() => {
    setSelectedProfileIds(new Set(displayedProfiles.map((p) => p.id)));
  }, [displayedProfiles]);

  // Summarise the displayed profiles using Claude Haiku — cache hits are free, misses are batched
  useEffect(() => {
    if (!isLiveData || displayedProfiles.length === 0) return;
    let cancelled = false;
    async function loadSummaries() {
      setSummariesLoading(true);
      try {
        const ids = displayedProfiles.map((p) => p.id);
        const cached = await getCachedSummaries(ids);
        if (!cancelled) setSummaries((prev) => ({ ...prev, ...cached }));

        const uncached = displayedProfiles.filter((p) => !cached[p.id] && p.careerSnapshot);
        if (!uncached.length) return;

        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: PROXY_HEADERS,
          body: JSON.stringify({
            candidates: uncached.map((p) => ({ id: p.id, description: p.careerSnapshot })),
          }),
        });
        if (!res.ok || cancelled) return;

        const { summaries: fresh } = await res.json();
        if (cancelled) return;
        const freshMap = Object.fromEntries((fresh || []).map((s) => [s.id, s.bullets]));
        setSummaries((prev) => ({ ...prev, ...freshMap }));
        await cacheSummaries(fresh || []);
      } catch {
        // Non-critical — fall back to qualitySignals silently
      } finally {
        if (!cancelled) setSummariesLoading(false);
      }
    }
    loadSummaries();
    return () => { cancelled = true; };
  }, [displayedProfiles, isLiveData]);

  const comparisonRows = useMemo(() => {
    return competitors.map((c, i) => {
      const price = i === 0 ? safeNumber(ajtPrice) : safeNumber(c.price);
      const costPerPlatform = calculateCostPerPlatform(price, c.coverage);
      return { ...c, price, costPerPlatform };
    });
  }, [competitors, ajtPrice]);

  const ajtSavings = useMemo(() => calculateSavings(comparisonRows), [comparisonRows]);

  function toggleLanguage(lang) {
    setRequiredLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  }

  function updateCompetitor(index, key, value) {
    setCompetitors((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function updateProfile(id, key, value) {
    setPool((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  }

  function handleShare() {
    if (selectedProfileIds.size === 0) return;
    const profiles = displayedProfiles.filter((p) => selectedProfileIds.has(p.id));

    const cardHtml = profiles.map((p) => {
      const bullets = summaries[p.id]?.length ? summaries[p.id] : p.qualitySignals;
      const visibleSkills = p.skills.slice(0, 5);
      const hiddenSkills = p.skills.slice(5);
      const hasMore = hiddenSkills.length > 0;
      const cardId = p.id.replace(/[^a-zA-Z0-9]/g, "-");

      return `
      <div class="card">
        <div class="card-header">
          <span class="name">${p.name.split(" ").map((w) => w[0]).join(".")}</span>
          <span class="badge-anon">🔒 Anonymised</span>
        </div>
        <div class="muted-box">
          <div class="label">Latest position / company</div>
          <div class="position">${p.latestPosition}</div>
          <div class="industry">${p.industry}</div>
        </div>
        <div class="meta">
          <span class="bold">${p.experience ? `${p.experience} experience` : "—"}</span>
          ${p.availability ? `<span class="dot">·</span><span class="bold">${p.availability}</span>` : ""}
          ${p.applicationCount > 0 ? `<span class="dot">·</span><span class="muted">${p.applicationCount} application${p.applicationCount !== 1 ? "s" : ""}</span>` : ""}
        </div>
        <div class="edu">${(p.educations && p.educations.length > 0 ? p.educations : p.education ? [p.education] : []).join("<br>")}</div>
        <div class="section">
          <div class="label">Languages</div>
          <div class="badges">${p.languages.map((l) => `<span class="badge">${l}</span>`).join("")}</div>
        </div>
        <div class="section">
          <div class="label">Skills</div>
          <div class="badges" id="skills-${cardId}">
            ${visibleSkills.map((s) => `<span class="badge">${s}</span>`).join("")}
            ${hasMore ? `
            <div id="hidden-${cardId}" style="display:none;flex-wrap:wrap;gap:6px;">${hiddenSkills.map((s) => `<span class="badge">${s}</span>`).join("")}</div>
            <button class="toggle-btn" onclick="toggleSkills('${cardId}')" id="btn-${cardId}" data-count="${hiddenSkills.length}">+${hiddenSkills.length} more</button>
            ` : ""}
          </div>
        </div>
        ${bullets.length ? `
        <div class="section">
          <div class="label">Career highlights</div>
          <ul class="bullets">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
        </div>` : ""}
      </div>`;
    }).join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Candidate Profiles${debouncedTitle ? ` – ${debouncedTitle}` : ""}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 32px 24px; background: #f8fafc; font-family: Inter, system-ui, sans-serif; font-size: 14px; color: #0f172a; }
    h1 { font-size: 20px; font-weight: 800; margin: 0 0 4px; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; }
    .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .name { font-size: 18px; font-weight: 900; }
    .badge-anon { font-size: 11px; color: #94a3b8; margin-left: auto; }
    .muted-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-top: 4px; }
    .label { color: #64748b; font-size: 12px; font-weight: 800; margin-bottom: 6px; }
    .position { font-weight: 900; margin-top: 4px; }
    .industry { font-size: 12px; color: #475569; margin-top: 6px; }
    .meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; font-size: 13px; }
    .bold { font-weight: 700; }
    .dot { color: #cbd5e1; }
    .muted { color: #64748b; }
    .edu { margin-top: 6px; color: #475569; font-size: 13px; }
    .section { margin-top: 16px; }
    .badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .badge { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 600; color: #334155; }
    .toggle-btn { background: none; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 3px 10px; font-size: 12px; color: #64748b; cursor: pointer; font-family: inherit; }
    .toggle-btn:hover { background: #f1f5f9; }
    .bullets { margin: 0; padding-left: 18px; color: #475569; font-size: 13px; line-height: 1.65; }
    footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>${debouncedTitle ? debouncedTitle.charAt(0).toUpperCase() + debouncedTitle.slice(1) + " " : ""}Candidates</h1>
  <p class="subtitle">${profiles.length} profile${profiles.length !== 1 ? "s" : ""} · Shared via AJobThing Catalogue · ${new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</p>
  <div class="grid">
    ${cardHtml}
  </div>
  <footer>Profiles are anonymised. Contact AJobThing to unlock full details.</footer>
  <script>
    function toggleSkills(id) {
      var hidden = document.getElementById('hidden-' + id);
      var btn = document.getElementById('btn-' + id);
      if (!hidden || !btn) return;
      var isHidden = hidden.style.display === 'none';
      hidden.style.display = isHidden ? 'flex' : 'none';
      btn.textContent = isHidden ? 'Show less' : '+' + btn.dataset.count + ' more';
    }
  <\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.download = `candidates-${(debouncedTitle || "profiles").toLowerCase().replace(/\s+/g, "-")}.html`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  }

  return (
    <div style={styles.page}>
      <ResponsiveNote />
      <div style={styles.container}>

        <div className="ajt-tabs" style={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{ ...styles.tab, background: activeTab === tab.id ? "#0f172a" : "#f8fafc", color: activeTab === tab.id ? "#fff" : "#334155" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profiles" && (
          <Card>
            <div style={styles.cardPad}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 4px" }}>Masked sample candidate profiles</h2>
                <p style={{ ...styles.subtitle, margin: 0 }}>Use this as proof-of-market only. Private data is masked until the proper candidate access workflow is connected.</p>
              </div>

              {/* Live data status bar — only shown while loading, on error, or when live results are active */}
              {(apiLoading || apiError || isLiveData) && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 16px", borderRadius: 14, background: apiError ? "#fef2f2" : apiLoading ? "#eff6ff" : "#f0fdf4", border: `1px solid ${apiError ? "#fecaca" : apiLoading ? "#bfdbfe" : "#bbf7d0"}` }}>
                <div style={{ flex: 1, fontSize: 13 }}>
                  {apiLoading
                    ? <span style={{ color: "#1d4ed8", fontWeight: 700 }}>⟳ Fetching live profiles…</span>
                    : apiError
                    ? <span style={{ color: "#991b1b", fontWeight: 700 }}>⚠ Could not reach live data. ({apiError})</span>
                    : <span style={{ color: "#166534", fontWeight: 700 }}>✓ Showing live candidate profiles</span>}
                </div>
              </div>
              )}

              {/* Job title search — queries the full candidate pool */}
              <div style={{ marginBottom: 16 }}>
                <div style={styles.label}>Search job title</div>
                <input
                  type="text"
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                  placeholder="e.g. HR Executive, Operations Manager, Sales Engineer…"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                />
                {titleQuery && debouncedTitle !== titleQuery && (
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Searching…</div>
                )}
              </div>

              {/* Requirements panel */}
              <div style={{ ...styles.mutedBox, marginBottom: 20 }}>
                <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 13 }}>Set requirements</div>
                <div className="ajt-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <Field label="Location">
                    <LocationSelector value={locationFilter} onChange={setLocationFilter} />
                  </Field>
                  <Field label="Required languages">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 2 }}>
                      {["Malay", "English", "Mandarin", "Tamil"].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          style={{
                            border: "1px solid",
                            borderRadius: 999,
                            padding: "6px 14px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            borderColor: requiredLanguages.includes(lang) ? "#0f172a" : "#cbd5e1",
                            background: requiredLanguages.includes(lang) ? "#0f172a" : "#fff",
                            color: requiredLanguages.includes(lang) ? "#fff" : "#475569",
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              {/* Result count + refresh + share */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...styles.small }}>
                    {isLiveData && pool.length > 0 && (
                      <span style={{ color: "#94a3b8" }}>{pool.length.toLocaleString()} fetched · </span>
                    )}
                    {!debouncedTitle && !apiLoading ? (
                      <span style={{ color: "#94a3b8" }}>Enter a job title above to search for candidates</span>
                    ) : eligibleProfiles.length > 0 ? (
                      <span>
                        <b>{eligibleProfiles.length}</b> eligible
                        {debouncedTitle ? ` "${debouncedTitle}"` : ""} candidate{eligibleProfiles.length !== 1 ? "s" : ""}
                        {(requiredLanguages.length > 0 || locationFilter) ? " matching filters" : ""}
                        {displayedProfiles.length < eligibleProfiles.length ? ` · showing top ${displayedProfiles.length}` : ""}
                      </span>
                    ) : (
                      <span>No candidates found{debouncedTitle ? ` for "${debouncedTitle}"` : ""}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { profileCache.clear(); setRefreshKey((k) => k + 1); }}
                    disabled={apiLoading}
                    title="Refresh profiles"
                    style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "4px 10px", cursor: apiLoading ? "default" : "pointer", fontSize: 13, color: "#64748b" }}
                  >
                    {apiLoading ? "Loading…" : "↻ Refresh"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={displayedProfiles.length === 0}
                  style={{
                    ...styles.button,
                    background: shared ? "#166534" : "#0f172a",
                    opacity: displayedProfiles.length === 0 ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                  }}
                >
                  <Icon name="share" size={16} />
                  {shared ? "Downloaded!" : `Share ${selectedProfileIds.size > 0 ? selectedProfileIds.size : ""} profile${selectedProfileIds.size !== 1 ? "s" : ""} as HTML`}
                </button>
              </div>

              {/* Selection controls */}
              {displayedProfiles.length > 0 && !apiLoading && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 13, color: "#64748b" }}>
                  <button type="button" onClick={() => setSelectedProfileIds(new Set(displayedProfiles.map((p) => p.id)))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0f172a", fontWeight: 700, fontSize: 13 }}>Select all</button>
                  <span>·</span>
                  <button type="button" onClick={() => setSelectedProfileIds(new Set())} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#64748b", fontSize: 13 }}>Deselect all</button>
                  <span>·</span>
                  <span>{selectedProfileIds.size} of {displayedProfiles.length} selected for sharing</span>
                </div>
              )}

              {/* Profile cards */}
              {apiLoading && (
                <div style={{ padding: 32, textAlign: "center", color: "#64748b", fontSize: 14 }}>Loading live profiles…</div>
              )}
              {!apiLoading && apiError && (
                <div style={{ padding: 16, borderRadius: 12, background: "#fef2f2", color: "#991b1b", fontSize: 13, marginBottom: 16 }}>
                  Could not load live profiles. Check your API key and try again. <br /><span style={{ opacity: 0.7 }}>{apiError}</span>
                </div>
              )}
              <div ref={profileCardsRef} className="ajt-grid-3" style={{ ...styles.grid3, display: apiLoading ? "none" : styles.grid3.display }}>
                {displayedProfiles.map((p) => (
                  <Card key={p.id}>
                    <div data-profile-id={p.id} style={{ padding: 20 }}>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={selectedProfileIds.has(p.id)}
                            onChange={() => setSelectedProfileIds((prev) => {
                              const next = new Set(prev);
                              next.has(p.id) ? next.delete(p.id) : next.add(p.id);
                              return next;
                            })}
                            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#0f172a" }}
                          />
                          <h3 style={{ margin: 0, fontSize: 18 }}>{p.name.split(" ").map((w) => w[0]).join(".")}</h3>
                          <Icon name="eyeOff" size={18} />
                          {!isOpenToWork(p) && (
                            <span style={{ marginLeft: "auto", fontSize: 11, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 4, padding: "2px 7px", fontWeight: 600, whiteSpace: "nowrap" }}>
                              Not open to work
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ ...styles.mutedBox, marginTop: 16, padding: 14 }}>
                        <div style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>Latest position / company</div>
                        <div style={{ fontWeight: 900, marginTop: 4 }}>{p.latestPosition}</div>
                        <div style={{ marginTop: 6, fontSize: 12, color: "#475569" }}>{p.industry}</div>
                      </div>
                      <div style={{ marginTop: 14, fontSize: 13 }}>
                        {(p.experience || p.availability || p.applicationCount > 0) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          {p.experience && <span style={{ fontWeight: 700 }}>{p.experience} experience</span>}
                          {p.availability && <><span style={{ color: "#cbd5e1" }}>{p.experience ? "·" : ""}</span><span style={{ fontWeight: 700 }}>{p.availability}</span></>}
                          {p.applicationCount > 0 && <><span style={{ color: "#cbd5e1" }}>·</span><span style={{ color: "#64748b" }}>{p.applicationCount} application{p.applicationCount !== 1 ? "s" : ""}</span></>}
                        </div>
                        )}
                        <div style={{ marginTop: 6, color: "#475569" }}>
                          {(p.educations && p.educations.length > 0 ? p.educations : p.education ? [p.education] : []).map((edu, i) => (
                            <div key={i} style={i > 0 ? { marginTop: 2 } : {}}>{edu}</div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <div style={{ color: "#64748b", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>Languages</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{p.languages.map((language) => <Badge key={language} light>{language}</Badge>)}</div>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <div style={{ color: "#64748b", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>Skills</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {(expandedSkills.has(p.id) ? p.skills : p.skills.slice(0, 5)).map((s) => <Badge key={s} light>{s}</Badge>)}
                          {p.skills.length > 5 && (
                            <button
                              type="button"
                              onClick={() => setExpandedSkills((prev) => { const next = new Set(prev); next.has(p.id) ? next.delete(p.id) : next.add(p.id); return next; })}
                              style={{ background: "none", border: "1px dashed #cbd5e1", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#64748b", cursor: "pointer" }}
                            >
                              {expandedSkills.has(p.id) ? "Show less" : `+${p.skills.length - 5} more`}
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <div style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>Career highlights</div>
                          {summariesLoading && !summaries[p.id] && (
                            <span style={{ color: "#94a3b8", fontSize: 11 }}>Summarising…</span>
                          )}
                        </div>
                        {(() => {
                          const bullets = summaries[p.id]?.length ? summaries[p.id] : p.qualitySignals;
                          if (!bullets.length) return <div style={{ color: "#94a3b8", fontSize: 13 }}>No summary available</div>;
                          return (
                            <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 13, lineHeight: 1.65 }}>
                              {bullets.map((b) => <li key={b}>{b}</li>)}
                            </ul>
                          );
                        })()}
                      </div>
                    </div>
                  </Card>
                ))}
                {displayedProfiles.length === 0 && !apiLoading && (
                  <div style={{ ...styles.small, gridColumn: "1 / -1", padding: 24, textAlign: "center" }}>
                    No candidates match the current requirements. Try adjusting the industry or language filters.
                  </div>
                )}
              </div>

              {/* Show all / show fewer toggle */}
              {eligibleProfiles.length > INITIAL_SHOW && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    style={{ ...styles.button, background: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0" }}
                  >
                    {showAll ? `Show fewer profiles` : `Show all ${eligibleProfiles.length} profiles`}
                  </button>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === "winning" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div className="ajt-grid-3" style={styles.grid3}>
              <Card><div style={styles.cardPad}><Icon name="shield" size={32} /><h3>AJT Care</h3><p style={styles.small}>Position AJT as a managed hiring partner, not a passive job board. AM support helps refine job ads, improve targeting, and follow up when response is weak.</p></div></Card>
              <Card><div style={styles.cardPad}><Icon name="check" size={32} /><h3>Performance guarantee</h3><p style={styles.small}>If the job ad does not exceed 10 applicants, customer receives a free job ad. This reduces buyer risk and gives a clear fallback.</p><div style={{ ...styles.mutedBox, marginTop: 16, fontWeight: 800 }}>Risk threshold: ≤ 10 applicants</div></div></Card>
              <Card><div style={styles.cardPad}><Icon name="megaphone" size={32} /><h3>Candidate blast</h3><p style={styles.small}>AJT can push the job to nearby and relevant candidates, creating active demand instead of waiting for candidates to search manually.</p></div></Card>
            </div>
            <Card>
              <div style={styles.cardPad}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="users" /><h3 style={{ margin: 0 }}>Applicant target simulator</h3></div>
                <p style={styles.small}>Set the target applicant count you want to discuss. The guarantee trigger remains fixed at 10 applicants.</p>
                <div className="ajt-simulator-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 260px", gap: 20, alignItems: "center", marginTop: 20 }}>
                  <div>
                    <input type="range" min="0" max="100" step="1" value={targetApplicants} onChange={(e) => setTargetApplicants(Math.max(0, Math.min(100, safeNumber(e.target.value))))} style={{ width: "100%" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: 12 }}><span>0 applicants</span><span>100 applicants</span></div>
                  </div>
                  <div style={styles.darkBox}>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>Target discussion point</div>
                    <div style={{ fontSize: 36, fontWeight: 900 }}>{targetApplicants}</div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>applicants</div>
                    <div style={{ marginTop: 16, fontSize: 14 }}>{getGuaranteeMessage(targetApplicants)}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "pricing" && (
          <Card>
            <div style={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22 }}>Configurable price comparison</h2>
                  <p style={styles.subtitle}>Use verified public data where available, but treat pricing as configurable because many platforms use dynamic or unpublished pricing.</p>
                </div>
                <div style={styles.mutedBox}><span style={{ color: "#64748b" }}>Estimated saving vs avg competitor:</span> <b>{ajtSavings > 0 ? currency(ajtSavings) : "No saving"}</b></div>
              </div>
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 18 }}>
                <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse", fontSize: 14 }}>
                  <thead style={{ background: "#f1f5f9", color: "#475569" }}>
                    <tr>
                      <th style={{ textAlign: "left", padding: 12 }}>Platform/package</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Price</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Coverage</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Cost/platform</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Support</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Guarantee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={row.name} style={{ borderTop: "1px solid #e2e8f0" }}>
                        <td style={{ padding: 12, fontWeight: 800 }}>{row.name}</td>
                        <td style={{ padding: 12 }}><TextInput type="number" value={row.price} onChange={(value) => i === 0 ? setAjtPrice(safeNumber(value)) : updateCompetitor(i, "price", safeNumber(value))} style={{ width: 120 }} /></td>
                        <td style={{ padding: 12 }}><TextInput type="number" value={row.coverage} onChange={(value) => updateCompetitor(i, "coverage", safeNumber(value, 1))} style={{ width: 90 }} /></td>
                        <td style={{ padding: 12, fontWeight: 800 }}>{currency(Math.round(row.costPerPlatform))}</td>
                        <td style={{ padding: 12 }}>{row.support}</td>
                        <td style={{ padding: 12 }}>{row.guarantee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 16, borderRadius: 16, background: "#fffbeb", color: "#78350f", padding: 16, fontSize: 14, lineHeight: 1.6 }}>Pricing should be verified before being shown to customers. Public sources often describe budget-based pricing instead of fixed Malaysian package prices.</div>
            </div>
          </Card>
        )}

        {activeTab === "platforms" && (
          <Card>
            <div style={styles.cardPad}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}><Icon name="globe" /><div><h2 style={{ margin: 0 }}>Why 6-platform exposure matters</h2><p style={styles.subtitle}>Frame this as reduced dependency risk: one job ad is not tied to a single candidate source.</p></div></div>
              <div className="ajt-grid-3" style={styles.grid3}>
                {platformDefaults.map((p) => (
                  <Card key={p.platform}>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12 }}><h3 style={{ margin: 0 }}>{p.platform}</h3><Badge light>{p.weight}% fit</Badge></div>
                      <ScoreBar value={p.weight} />
                      <p style={styles.small}>{p.benefit}</p>
                      <div style={styles.mutedBox}><b>Best used for:</b> {p.use}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
