export interface Question {
  id?: string
  type: 'single' | 'multiple' | 'text' | 'dropdown' | 'rating'
  title: string
  options?: string[]
  required: boolean
  order: number
}

export interface Survey {
  id?: string
  title: string
  description?: string
  is_public: boolean
  password?: string
  questions: Question[]
}

export interface Response {
  id?: string
  survey_id: string
  answers: Record<string, any>
  submitted_at?: string
}
