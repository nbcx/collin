import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      surveys: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          is_public: boolean
          password: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id: string
          is_public?: boolean
          password?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string
          is_public?: boolean
          password?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          survey_id: string
          type: 'single' | 'multiple' | 'text' | 'dropdown' | 'rating'
          title: string
          options: string[] | null
          required: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          survey_id: string
          type: 'single' | 'multiple' | 'text' | 'dropdown' | 'rating'
          title: string
          options?: string[] | null
          required?: boolean
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          survey_id?: string
          type?: 'single' | 'multiple' | 'text' | 'dropdown' | 'rating'
          title?: string
          options?: string[] | null
          required?: boolean
          order?: number
          created_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          survey_id: string
          answers: Record<string, any>
          submitted_at: string
        }
        Insert: {
          id?: string
          survey_id: string
          answers: Record<string, any>
          submitted_at?: string
        }
        Update: {
          id?: string
          survey_id?: string
          answers?: Record<string, any>
          submitted_at?: string
        }
      }
    }
  }
}
