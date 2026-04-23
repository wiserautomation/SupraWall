// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export type Regulation = 'EU_AI_ACT' | 'GDPR' | 'NIS2' | 'DORA' | 'ISO_42001' | 'CRA'
export type SupraWallFeature = 'policy-engine' | 'audit-trail' | 'hitl' | 'incident-detection' | 'pii-detection' | 'analytics'

export interface TemplateConfig {
  slug: string                    // 'hr-employment', 'biometrics', etc.
  name: string                    // "HR & Employment", etc.
  annexIIICategory: number        // 1–8
  conformityAssessment: 
    | 'self-assessment' 
    | 'third-party-mandatory'
    | 'third-party-conditional'   // healthcare medical devices
  diyEngineeringWeeks: {
    min: number
    max: number
  }
  diyCostEur: {
    min: number
    max: number
  }
  sectorProhibitions: string[]    // what the agent CANNOT do
  sectorMandatoryControls: string[] // what the agent MUST do
  regulationOverlap: Regulation[] // which other regulations also apply
  deadline: string                // '2026-08-02' or '2027-08-02' for medical devices
}

export interface ComplianceEntry {
  regulation: Regulation
  article: string          // "Art. 12" | "Clause 8.4"
  requirement: string      // human-readable, EN
  suprawallFeature: SupraWallFeature[]
  evidenceGenerated: string
  severity: 'critical' | 'high' | 'medium'
  deadline: string | "active" | "procurement-driven"  // ISO date string like "2026-08-02", or special status
  sectors?: string[]       // ["finance", "healthcare"] — undefined = all sectors
}

export const complianceMatrix: ComplianceEntry[] = [
  {
    regulation: 'EU_AI_ACT',
    article: 'Art. 12',
    requirement: 'Tamper-evident automatic logging of inputs, outputs, and decisions',
    suprawallFeature: ['audit-trail'],
    evidenceGenerated: 'Tamper-evident log export (JSON/PDF)',
    severity: 'critical',
    deadline: '2026-08-02',
  },
  {
    regulation: 'EU_AI_ACT',
    article: 'Art. 14',
    requirement: 'Human oversight mechanism — ability to review and override agent decisions',
    suprawallFeature: ['hitl'],
    evidenceGenerated: 'Approval records with timestamps and reviewer ID',
    severity: 'critical',
    deadline: '2026-08-02',
  },
  {
    regulation: 'EU_AI_ACT',
    article: 'Art. 9',
    requirement: 'Risk management system for the AI system lifecycle',
    suprawallFeature: ['policy-engine'],
    evidenceGenerated: 'Policy audit log with ALLOW/DENY decisions',
    severity: 'critical',
    deadline: '2026-08-02',
  },
  {
    regulation: 'GDPR',
    article: 'Art. 5(1)(c)',
    requirement: 'Data minimisation — limit personal data processing to what is necessary',
    suprawallFeature: ['pii-detection', 'policy-engine'],
    evidenceGenerated: 'PII detection log + data handling record per session',
    severity: 'critical',
    deadline: 'active',
  },
  {
    regulation: 'GDPR',
    article: 'Art. 22',
    requirement: 'Human oversight for automated decisions with significant effects on individuals',
    suprawallFeature: ['hitl'],
    evidenceGenerated: 'Override and approval records with human reviewer ID',
    severity: 'critical',
    deadline: 'active',
  },
  {
    regulation: 'GDPR',
    article: 'Art. 30',
    requirement: 'Records of processing activities (ROPA)',
    suprawallFeature: ['audit-trail'],
    evidenceGenerated: 'ROPA-compliant processing registry export',
    severity: 'high',
    deadline: 'active',
  },
  {
    regulation: 'NIS2',
    article: 'Art. 21',
    requirement: 'Cybersecurity risk management measures for ICT systems',
    suprawallFeature: ['policy-engine', 'audit-trail'],
    evidenceGenerated: 'Security control log with policy enforcement records',
    severity: 'high',
    deadline: '2026-10-01',
  },
  {
    regulation: 'NIS2',
    article: 'Art. 23',
    requirement: 'Incident notification within 24 hours to national authority',
    suprawallFeature: ['incident-detection', 'audit-trail'],
    evidenceGenerated: 'Incident report with full timeline and severity classification',
    severity: 'critical',
    deadline: '2026-10-01',
  },
  {
    regulation: 'DORA',
    article: 'Art. 8',
    requirement: 'ICT risk management framework — continuous monitoring and control',
    suprawallFeature: ['policy-engine', 'audit-trail'],
    evidenceGenerated: 'ICT risk log with control activation records',
    severity: 'critical',
    deadline: 'active',
    sectors: ['finance'],
  },
  {
    regulation: 'DORA',
    article: 'Art. 17',
    requirement: 'ICT-related incident management and classification',
    suprawallFeature: ['incident-detection', 'audit-trail'],
    evidenceGenerated: 'Incident register with impact classification',
    severity: 'critical',
    deadline: 'active',
    sectors: ['finance'],
  },
  {
    regulation: 'ISO_42001',
    article: 'Clause 8',
    requirement: 'Operational AI controls — lifecycle documentation and runtime governance',
    suprawallFeature: ['policy-engine', 'audit-trail', 'hitl'],
    evidenceGenerated: 'Full operational documentation export for AIMS audit',
    severity: 'high',
    deadline: 'procurement-driven',
  },
  {
    regulation: 'ISO_42001',
    article: 'Clause 9',
    requirement: 'Performance evaluation — monitoring, measurement, analysis',
    suprawallFeature: ['analytics', 'audit-trail'],
    evidenceGenerated: 'Performance evaluation report with trend data',
    severity: 'medium',
    deadline: 'procurement-driven',
  },
  {
    regulation: 'CRA',
    article: 'Art. 14',
    requirement: 'Vulnerability notification and security incident documentation',
    suprawallFeature: ['incident-detection', 'audit-trail'],
    evidenceGenerated: 'Vulnerability log with disclosure timeline',
    severity: 'high',
    deadline: '2027-12-11',
  },
]

// ─── Utility helpers — use these in every page component ───────────────────

export const getByRegulation = (reg: Regulation) =>
  complianceMatrix.filter(e => e.regulation === reg)

export const getByFeature = (feature: SupraWallFeature) =>
  complianceMatrix.filter(e => e.suprawallFeature.includes(feature))

export const getBySector = (sector: string) =>
  complianceMatrix.filter(e => !e.sectors || e.sectors.includes(sector))

export const getCritical = () =>
  complianceMatrix.filter(e => e.severity === 'critical')

export const getActiveDeadlines = () =>
  complianceMatrix.filter(e => e.deadline !== 'procurement-driven')

export const sectorTemplates: TemplateConfig[] = [
  {
    slug: 'biometrics',
    name: 'Biometric AI',
    annexIIICategory: 1,
    conformityAssessment: 'third-party-mandatory',
    diyEngineeringWeeks: { min: 19, max: 30 },
    diyCostEur: { min: 76000, max: 120000 },
    sectorProhibitions: ['Remote biometric identification in public spaces (Art. 5)'],
    sectorMandatoryControls: ['Identification event logging', 'Prohibited-use blockers', 'Emotion recognition limits'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  },
  {
    slug: 'critical-infrastructure',
    name: 'Critical Infrastructure',
    annexIIICategory: 2,
    conformityAssessment: 'self-assessment',
    diyEngineeringWeeks: { min: 21, max: 33 },
    diyCostEur: { min: 84000, max: 132000 },
    sectorProhibitions: ['Autonomous execution of physical infrastructure changes'],
    sectorMandatoryControls: ['Physical action HITL gate', 'Failsafe override system', 'Real-time incident detection'],
    regulationOverlap: ['NIS2'],
    deadline: '2026-08-02'
  },
  {
    slug: 'education',
    name: 'Education & Training',
    annexIIICategory: 3,
    conformityAssessment: 'self-assessment',
    diyEngineeringWeeks: { min: 17, max: 27 },
    diyCostEur: { min: 68000, max: 108000 },
    sectorProhibitions: ['Autonomous denial of education access'],
    sectorMandatoryControls: ['Admission HITL gate', 'Assessment explanation engine', 'Anomaly threshold monitoring'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  },
  {
    slug: 'hr-employment',
    name: 'HR & Employment',
    annexIIICategory: 4,
    conformityAssessment: 'self-assessment',
    diyEngineeringWeeks: { min: 21, max: 34 },
    diyCostEur: { min: 84000, max: 136000 },
    sectorProhibitions: ['Autonomous hire/fire decisions'],
    sectorMandatoryControls: ['Final decision HITL gate', 'Bias audit trail', 'Employee monitoring disclosure'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    annexIIICategory: 5,
    conformityAssessment: 'third-party-conditional',
    diyEngineeringWeeks: { min: 22, max: 36 },
    diyCostEur: { min: 88000, max: 144000 },
    sectorProhibitions: ['Autonomous denial of healthcare benefits or triage'],
    sectorMandatoryControls: ['PHI encryption', 'Breach notification pipeline', 'Medical device pathway alignment'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  },
  {
    slug: 'law-enforcement',
    name: 'Law Enforcement',
    annexIIICategory: 6,
    conformityAssessment: 'third-party-mandatory',
    diyEngineeringWeeks: { min: 21, max: 35 },
    diyCostEur: { min: 84000, max: 140000 },
    sectorProhibitions: ['Actions based solely on automated profiling'],
    sectorMandatoryControls: ['Automated action refusal', 'Probabilistic output labeling', 'Profiling detection'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  },
  {
    slug: 'migration-border-control',
    name: 'Migration & Border',
    annexIIICategory: 7,
    conformityAssessment: 'third-party-mandatory',
    diyEngineeringWeeks: { min: 21, max: 34 },
    diyCostEur: { min: 84000, max: 136000 },
    sectorProhibitions: ['Autonomous asylum or visa outcomes'],
    sectorMandatoryControls: ['Asylum decision hard block', 'Nationality bias guard', 'Individual risk score HITL'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  },
  {
    slug: 'justice-democracy',
    name: 'Justice & Democracy',
    annexIIICategory: 8,
    conformityAssessment: 'third-party-mandatory',
    diyEngineeringWeeks: { min: 21, max: 35 },
    diyCostEur: { min: 84000, max: 140000 },
    sectorProhibitions: ['Autonomous legal interpretation', 'Electoral influence'],
    sectorMandatoryControls: ['Non-binding output labeler', 'Sentencing flag enforcer', 'Electoral influence disable'],
    regulationOverlap: ['GDPR'],
    deadline: '2026-08-02'
  }
]

export const getTemplateBySlug = (slug: string) =>
  sectorTemplates.find(t => t.slug === slug)
