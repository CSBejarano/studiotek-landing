export interface LeadData {
  budget?: string
  service_interest?: string
  phone?: string
  company?: string
  message?: string
  source?: string
}

export type LeadClassification = 'hot' | 'warm' | 'cold'

export interface ScoringResult {
  score: number
  classification: LeadClassification
  breakdown: Record<string, number>
}

const BUDGET_SCORES: Record<string, number> = {
  'mas-50000': 40,
  '25000-50000': 40,
  '10000-25000': 40,
  '3000-10000': 25,
  'menos-3000': 10,
  'no-seguro': 5,
}

export function calculateLeadScore(data: LeadData): ScoringResult {
  const breakdown: Record<string, number> = {}
  let score = 0

  // Budget score (max +40)
  if (data.budget && BUDGET_SCORES[data.budget]) {
    const points = BUDGET_SCORES[data.budget]
    breakdown['budget'] = points
    score += points
  }

  // Service interest selected (+15)
  if (data.service_interest && data.service_interest.length > 0) {
    breakdown['service_interest'] = 15
    score += 15
  }

  // Phone provided (+10)
  if (data.phone && data.phone.trim().length > 0) {
    breakdown['phone'] = 10
    score += 10
  }

  // Company provided (+10)
  if (data.company && data.company.trim().length > 0) {
    breakdown['company'] = 10
    score += 10
  }

  // Message quality (max +15)
  if (data.message) {
    const len = data.message.trim().length
    if (len > 50) {
      breakdown['message'] = 15
      score += 15
    } else if (len > 20) {
      breakdown['message'] = 5
      score += 5
    }
  }

  // Source bonus (+5 for ai_chat - higher intent)
  if (data.source === 'ai_chat') {
    breakdown['source_ai_chat'] = 5
    score += 5
  }

  const classification = classifyLead(score)

  return { score, classification, breakdown }
}

export function classifyLead(score: number): LeadClassification {
  if (score >= 80) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}
