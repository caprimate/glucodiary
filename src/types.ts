export interface GlucoseReading {
  id: number
  user_id: string
  measured_at: string
  before_eating?: number | null
  after_eating?: number | null
  notes?: string | null
  created_at: string
}
