export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: number
          ip_hash: string | null
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: never
          ip_hash?: string | null
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: never
          ip_hash?: string | null
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_entries: {
        Row: {
          archived_at: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          created_by: string | null
          draft_data: Json
          id: string
          locale: string
          lock_version: number
          published_at: string | null
          published_data: Json | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          archived_at?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          id?: string
          locale?: string
          lock_version?: number
          published_at?: string | null
          published_data?: Json | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          archived_at?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          id?: string
          locale?: string
          lock_version?: number
          published_at?: string | null
          published_data?: Json | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_entries_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_relations: {
        Row: {
          created_at: string
          created_by: string | null
          relation_type: string
          sort_order: number
          source_id: string
          target_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          relation_type: string
          sort_order?: number
          source_id: string
          target_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          relation_type?: string
          sort_order?: number
          source_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_relations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_relations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_relations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "published_content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_relations_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_relations_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "published_content_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          event: Database["public"]["Enums"]["revision_event"]
          id: string
          resource_id: string
          resource_type: string
          snapshot: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event: Database["public"]["Enums"]["revision_event"]
          id?: string
          resource_id: string
          resource_type: string
          snapshot: Json
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event?: Database["public"]["Enums"]["revision_event"]
          id?: string
          resource_id?: string
          resource_type?: string
          snapshot?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string
          archived_at: string | null
          bucket: string
          byte_size: number
          caption: string | null
          checksum: string
          created_at: string
          credit: string | null
          focal_x: number
          focal_y: number
          height: number | null
          id: string
          mime_type: string
          original_name: string
          status: Database["public"]["Enums"]["media_status"]
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string
          archived_at?: string | null
          bucket?: string
          byte_size: number
          caption?: string | null
          checksum: string
          created_at?: string
          credit?: string | null
          focal_x?: number
          focal_y?: number
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          status?: Database["public"]["Enums"]["media_status"]
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string
          archived_at?: string | null
          bucket?: string
          byte_size?: number
          caption?: string | null
          checksum?: string
          created_at?: string
          credit?: string | null
          focal_x?: number
          focal_y?: number
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          status?: Database["public"]["Enums"]["media_status"]
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_usages: {
        Row: {
          asset_id: string
          content_entry_id: string | null
          created_at: string
          field_key: string
          id: string
          page_section_id: string | null
          site_setting_key: string | null
        }
        Insert: {
          asset_id: string
          content_entry_id?: string | null
          created_at?: string
          field_key: string
          id?: string
          page_section_id?: string | null
          site_setting_key?: string | null
        }
        Update: {
          asset_id?: string
          content_entry_id?: string | null
          created_at?: string
          field_key?: string
          id?: string
          page_section_id?: string | null
          site_setting_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_usages_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_usages_content_entry_id_fkey"
            columns: ["content_entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_usages_content_entry_id_fkey"
            columns: ["content_entry_id"]
            isOneToOne: false
            referencedRelation: "published_content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_usages_page_section_id_fkey"
            columns: ["page_section_id"]
            isOneToOne: false
            referencedRelation: "page_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_usages_page_section_id_fkey"
            columns: ["page_section_id"]
            isOneToOne: false
            referencedRelation: "published_page_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_usages_site_setting_key_fkey"
            columns: ["site_setting_key"]
            isOneToOne: false
            referencedRelation: "published_site_settings"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "media_usages_site_setting_key_fkey"
            columns: ["site_setting_key"]
            isOneToOne: false
            referencedRelation: "site_settings"
            referencedColumns: ["key"]
          },
        ]
      }
      page_sections: {
        Row: {
          component_key: string
          created_at: string
          created_by: string | null
          draft_data: Json
          enabled: boolean
          id: string
          key: string
          lock_version: number
          page_id: string
          published_at: string | null
          published_data: Json | null
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          component_key: string
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          enabled?: boolean
          id?: string
          key: string
          lock_version?: number
          page_id: string
          published_at?: string | null
          published_data?: Json | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          component_key?: string
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          enabled?: boolean
          id?: string
          key?: string
          lock_version?: number
          page_id?: string
          published_at?: string | null
          published_data?: Json | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "published_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          created_by: string | null
          enabled: boolean
          id: string
          key: string
          locale: string
          lock_version: number
          name: string
          path: string
          template_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          key: string
          locale?: string
          lock_version?: number
          name: string
          path: string
          template_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          key?: string
          locale?: string
          lock_version?: number
          name?: string
          path?: string
          template_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string
          id: string
          key: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string
          id?: string
          key: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          id?: string
          key?: string
          resource?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_asset_id: string | null
          created_at: string
          display_name: string
          id: string
          last_seen_at: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          avatar_asset_id?: string | null
          created_at?: string
          display_name?: string
          id: string
          last_seen_at?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          avatar_asset_id?: string | null
          created_at?: string
          display_name?: string
          id?: string
          last_seen_at?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_avatar_asset_id_fkey"
            columns: ["avatar_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          created_at: string
          created_by: string | null
          destination_path: string
          enabled: boolean
          id: string
          lock_version: number
          source_path: string
          status_code: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          destination_path: string
          enabled?: boolean
          id?: string
          lock_version?: number
          source_path: string
          status_code?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          destination_path?: string
          enabled?: boolean
          id?: string
          lock_version?: number
          source_path?: string
          status_code?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redirects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redirects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          is_system: boolean
          key: string
          name: string
          rank: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_system?: boolean
          key: string
          name: string
          rank: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_system?: boolean
          key?: string
          name?: string
          rank?: number
          updated_at?: string
        }
        Relationships: []
      }
      seo_entries: {
        Row: {
          content_entry_id: string | null
          created_at: string
          created_by: string | null
          draft_data: Json
          id: string
          locale: string
          lock_version: number
          page_id: string | null
          published_at: string | null
          published_data: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_entry_id?: string | null
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          id?: string
          locale?: string
          lock_version?: number
          page_id?: string | null
          published_at?: string | null
          published_data?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_entry_id?: string | null
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          id?: string
          locale?: string
          lock_version?: number
          page_id?: string | null
          published_at?: string | null
          published_data?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_entries_content_entry_id_fkey"
            columns: ["content_entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_content_entry_id_fkey"
            columns: ["content_entry_id"]
            isOneToOne: false
            referencedRelation: "published_content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "published_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          created_by: string | null
          draft_value: Json
          group_key: string
          is_public: boolean
          key: string
          lock_version: number
          published_at: string | null
          published_value: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          draft_value?: Json
          group_key: string
          is_public?: boolean
          key: string
          lock_version?: number
          published_at?: string | null
          published_value?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          draft_value?: Json
          group_key?: string
          is_public?: boolean
          key?: string
          lock_version?: number
          published_at?: string | null
          published_value?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      published_content_entries: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type"] | null
          data: Json | null
          id: string | null
          locale: string | null
          published_at: string | null
          slug: string | null
          sort_order: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content_type?: Database["public"]["Enums"]["content_type"] | null
          data?: Json | null
          id?: string | null
          locale?: string | null
          published_at?: string | null
          slug?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type"] | null
          data?: Json | null
          id?: string | null
          locale?: string | null
          published_at?: string | null
          slug?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      published_page_sections: {
        Row: {
          component_key: string | null
          data: Json | null
          id: string | null
          key: string | null
          page_id: string | null
          published_at: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          component_key?: string | null
          data?: Json | null
          id?: string | null
          key?: string | null
          page_id?: string | null
          published_at?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          component_key?: string | null
          data?: Json | null
          id?: string | null
          key?: string | null
          page_id?: string | null
          published_at?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "published_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      published_pages: {
        Row: {
          id: string | null
          key: string | null
          locale: string | null
          name: string | null
          path: string | null
          template_key: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string | null
          key?: string | null
          locale?: string | null
          name?: string | null
          path?: string | null
          template_key?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          key?: string | null
          locale?: string | null
          name?: string | null
          path?: string | null
          template_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      published_seo_entries: {
        Row: {
          content_entry_id: string | null
          data: Json | null
          id: string | null
          locale: string | null
          page_id: string | null
          published_at: string | null
          updated_at: string | null
        }
        Insert: {
          content_entry_id?: string | null
          data?: Json | null
          id?: string | null
          locale?: string | null
          page_id?: string | null
          published_at?: string | null
          updated_at?: string | null
        }
        Update: {
          content_entry_id?: string | null
          data?: Json | null
          id?: string | null
          locale?: string | null
          page_id?: string | null
          published_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_entries_content_entry_id_fkey"
            columns: ["content_entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_content_entry_id_fkey"
            columns: ["content_entry_id"]
            isOneToOne: false
            referencedRelation: "published_content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_entries_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "published_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      published_site_settings: {
        Row: {
          group_key: string | null
          key: string | null
          published_at: string | null
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          group_key?: string | null
          key?: string | null
          published_at?: string | null
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          group_key?: string | null
          key?: string | null
          published_at?: string | null
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      cms_archive_destination: {
        Args: {
          expected_lock_version: number
          requested_destination_id: string
        }
        Returns: Json
      }
      cms_create_destination: {
        Args: {
          content_data: Json
          requested_locale: string
          requested_slug: string
          requested_title: string
          seo_data: Json
        }
        Returns: string
      }
      cms_create_page: {
        Args: {
          hero_data: Json
          requested_key: string
          requested_locale: string
          requested_name: string
          requested_path: string
          seo_data: Json
        }
        Returns: string
      }
      cms_create_service: {
        Args: {
          content_data: Json
          requested_locale: string
          requested_slug: string
          requested_title: string
          seo_data: Json
        }
        Returns: string
      }
      cms_publish_destination: {
        Args: {
          content_data: Json
          expected_lock_version: number
          requested_destination_id: string
          seo_data: Json
        }
        Returns: Json
      }
      cms_publish_page: {
        Args: {
          expected_lock_version: number
          hero_data: Json
          requested_page_id: string
          seo_data: Json
        }
        Returns: Json
      }
      cms_publish_service: {
        Args: {
          content_data: Json
          expected_lock_version: number
          requested_service_id: string
          seo_data: Json
        }
        Returns: Json
      }
      cms_restore_destination_revision: {
        Args: {
          expected_lock_version: number
          requested_destination_id: string
          requested_revision_id: string
        }
        Returns: Json
      }
      cms_restore_page_revision: {
        Args: {
          expected_lock_version: number
          requested_page_id: string
          requested_revision_id: string
        }
        Returns: Json
      }
      cms_restore_service_revision: {
        Args: {
          expected_lock_version: number
          requested_revision_id: string
          requested_service_id: string
        }
        Returns: Json
      }
      cms_save_destination_draft: {
        Args: {
          content_data: Json
          create_revision?: boolean
          expected_lock_version: number
          requested_destination_id: string
          seo_data: Json
        }
        Returns: Json
      }
      cms_save_page_draft: {
        Args: {
          create_revision?: boolean
          expected_lock_version: number
          hero_data: Json
          requested_page_id: string
          seo_data: Json
        }
        Returns: Json
      }
      cms_save_service_draft: {
        Args: {
          content_data: Json
          create_revision?: boolean
          expected_lock_version: number
          requested_service_id: string
          seo_data: Json
        }
        Returns: Json
      }
      cms_unpublish_destination: {
        Args: {
          expected_lock_version: number
          requested_destination_id: string
        }
        Returns: Json
      }
      cms_unpublish_page: {
        Args: { expected_lock_version: number; requested_page_id: string }
        Returns: Json
      }
      cms_unpublish_service: {
        Args: { expected_lock_version: number; requested_service_id: string }
        Returns: Json
      }
      current_cms_context: { Args: never; Returns: Json }
      current_user_can_assign_role: {
        Args: { target_role_id: string }
        Returns: boolean
      }
      current_user_has_permission: {
        Args: { requested_permission: string }
        Returns: boolean
      }
      current_user_highest_role_rank: { Args: never; Returns: number }
    }
    Enums: {
      content_status: "draft" | "published" | "archived"
      content_type:
        | "service"
        | "destination"
        | "hospitality"
        | "cruise"
        | "brand"
        | "office"
        | "certification"
        | "article"
        | "navigation_item"
      media_status: "processing" | "ready" | "archived"
      profile_status: "active" | "suspended"
      revision_event:
        | "draft_saved"
        | "published"
        | "unpublished"
        | "archived"
        | "restored"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      content_status: ["draft", "published", "archived"],
      content_type: [
        "service",
        "destination",
        "hospitality",
        "cruise",
        "brand",
        "office",
        "certification",
        "article",
        "navigation_item",
      ],
      media_status: ["processing", "ready", "archived"],
      profile_status: ["active", "suspended"],
      revision_event: [
        "draft_saved",
        "published",
        "unpublished",
        "archived",
        "restored",
      ],
    },
  },
} as const
