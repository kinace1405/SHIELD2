export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          business_name: string
          subscription_tier: string
          webhook_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          business_name: string
          subscription_tier?: string
          webhook_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          business_name?: string
          subscription_tier?: string
          webhook_url?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json
          category: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: Json
          category: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json
          category?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      shield_conversations: {
        Row: {
          id: string
          user_id: string
          messages: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
