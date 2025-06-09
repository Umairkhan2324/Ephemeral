export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      servers: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          server_id: string
          content_text: string | null
          media_url: string | null
          media_type: string | null
          created_at: string
          expires_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          server_id: string
          content_text?: string | null
          media_url?: string | null
          media_type?: string | null
          created_at?: string
          expires_at: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          server_id?: string
          content_text?: string | null
          media_url?: string | null
          media_type?: string | null
          created_at?: string
          expires_at?: string
          updated_at?: string
        }
      }
    }
  }
}
