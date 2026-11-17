
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "buddies": {
                  Row: {
                    "accepted_at": string | null,"addressee_id": string,"created_at": string,"relation": string | null,"relation_proposed": string | null,"relation_proposed_by": string | null,"requester_id": string,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "accepted_at"?: string | null,"addressee_id": string,"created_at"?: string,"relation"?: string | null,"relation_proposed"?: string | null,"relation_proposed_by"?: string | null,"requester_id": string,"status"?: string
                  }
                  Update: {
                    "accepted_at"?: string | null,"addressee_id"?: string,"created_at"?: string,"relation"?: string | null,"relation_proposed"?: string | null,"relation_proposed_by"?: string | null,"requester_id"?: string,"status"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "buddies_addressee_id_fkey"
      columns: ["addressee_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "buddies_relation_proposed_by_fkey"
      columns: ["relation_proposed_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "buddies_requester_id_fkey"
      columns: ["requester_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"comments": {
                  Row: {
                    "created_at": string,"id": string,"item_id": string,"text": string,"trip_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"item_id": string,"text": string,"trip_id": string,"user_id"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"item_id"?: string,"text"?: string,"trip_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "comments_item_id_trip_id_fkey"
      columns: ["item_id","trip_id"]
isOneToOne: false
      referencedRelation: "items"
      referencedColumns: ["id","trip_id"]
    },{
      foreignKeyName: "comments_profile_fk"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"dogs": {
                  Row: {
                    "alone": number | null,"car": number | null,"created_at": string,"energy": number | null,"id": string,"interests": (string)[],"name": string,"owner_id": string,"photo_url": string | null,"recall": string | null,"recall_level": number | null,"temp": number | null,"updated_at": string,"weight_lb": number | null,"weight_unit": string,"with_dogs": number | null,"with_people": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "alone"?: number | null,"car"?: number | null,"created_at"?: string,"energy"?: number | null,"id"?: string,"interests"?: (string)[],"name": string,"owner_id"?: string,"photo_url"?: string | null,"recall"?: string | null,"recall_level"?: number | null,"temp"?: number | null,"updated_at"?: string,"weight_lb"?: number | null,"weight_unit"?: string,"with_dogs"?: number | null,"with_people"?: number | null
                  }
                  Update: {
                    "alone"?: number | null,"car"?: number | null,"created_at"?: string,"energy"?: number | null,"id"?: string,"interests"?: (string)[],"name"?: string,"owner_id"?: string,"photo_url"?: string | null,"recall"?: string | null,"recall_level"?: number | null,"temp"?: number | null,"updated_at"?: string,"weight_lb"?: number | null,"weight_unit"?: string,"with_dogs"?: number | null,"with_people"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "dogs_profile_fk"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"families": {
                  Row: {
                    "created_at": string,"created_by": string,"id": string,"invite_code": string | null,"invite_expires": string | null,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by": string,"id"?: string,"invite_code"?: string | null,"invite_expires"?: string | null,"name": string
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string,"id"?: string,"invite_code"?: string | null,"invite_expires"?: string | null,"name"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "families_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"family_members": {
                  Row: {
                    "created_at": string,"family_id": string,"invited_by": string | null,"role": string,"status": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"family_id": string,"invited_by"?: string | null,"role"?: string,"status"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"family_id"?: string,"invited_by"?: string | null,"role"?: string,"status"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "family_members_family_id_fkey"
      columns: ["family_id"]
isOneToOne: false
      referencedRelation: "families"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "family_members_invited_by_fkey"
      columns: ["invited_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "family_members_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"feedback": {
                  Row: {
                    "app_version": string | null,"created_at": string,"fixed_in": string | null,"handled_at": string | null,"id": string,"kind": string,"lang": string | null,"message": string,"platform": string | null,"resolution": string | null,"route": string | null,"screenshot_path": string | null,"status": string,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "app_version"?: string | null,"created_at"?: string,"fixed_in"?: string | null,"handled_at"?: string | null,"id"?: string,"kind": string,"lang"?: string | null,"message": string,"platform"?: string | null,"resolution"?: string | null,"route"?: string | null,"screenshot_path"?: string | null,"status"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "app_version"?: string | null,"created_at"?: string,"fixed_in"?: string | null,"handled_at"?: string | null,"id"?: string,"kind"?: string,"lang"?: string | null,"message"?: string,"platform"?: string | null,"resolution"?: string | null,"route"?: string | null,"screenshot_path"?: string | null,"status"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"item_dogs": {
                  Row: {
                    "dog_id": string,"item_id": string,"mode": string,"mood": string | null,"trip_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "dog_id": string,"item_id": string,"mode"?: string,"mood"?: string | null,"trip_id": string
                  }
                  Update: {
                    "dog_id"?: string,"item_id"?: string,"mode"?: string,"mood"?: string | null,"trip_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "item_dogs_item_id_trip_id_fkey"
      columns: ["item_id","trip_id"]
isOneToOne: false
      referencedRelation: "items"
      referencedColumns: ["id","trip_id"]
    },{
      foreignKeyName: "item_dogs_trip_id_dog_id_fkey"
      columns: ["trip_id","dog_id"]
isOneToOne: false
      referencedRelation: "trip_dogs"
      referencedColumns: ["trip_id","dog_id"]
    }
                  ]
                },"items": {
                  Row: {
                    "addr": string,"ai": Json | null,"ai_key": string | null,"cat": string | null,"confirmed": boolean,"created_at": string,"created_by": string | null,"date": string | null,"deleted_at": string | null,"deleted_by": string | null,"edited_at": string,"edited_by": string | null,"emoji": string | null,"end_min": number | null,"id": string,"lat": number | null,"lon": number | null,"notes": string,"place": string,"source": string | null,"start_min": number | null,"stay_from": string | null,"stay_to": string | null,"title": string,"travel_min": number | null,"trip_id": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "addr"?: string,"ai"?: Json | null,"ai_key"?: string | null,"cat"?: string | null,"confirmed"?: boolean,"created_at"?: string,"created_by"?: string | null,"date"?: string | null,"deleted_at"?: string | null,"deleted_by"?: string | null,"edited_at"?: string,"edited_by"?: string | null,"emoji"?: string | null,"end_min"?: number | null,"id"?: string,"lat"?: number | null,"lon"?: number | null,"notes"?: string,"place"?: string,"source"?: string | null,"start_min"?: number | null,"stay_from"?: string | null,"stay_to"?: string | null,"title"?: string,"travel_min"?: number | null,"trip_id": string,"type": string
                  }
                  Update: {
                    "addr"?: string,"ai"?: Json | null,"ai_key"?: string | null,"cat"?: string | null,"confirmed"?: boolean,"created_at"?: string,"created_by"?: string | null,"date"?: string | null,"deleted_at"?: string | null,"deleted_by"?: string | null,"edited_at"?: string,"edited_by"?: string | null,"emoji"?: string | null,"end_min"?: number | null,"id"?: string,"lat"?: number | null,"lon"?: number | null,"notes"?: string,"place"?: string,"source"?: string | null,"start_min"?: number | null,"stay_from"?: string | null,"stay_to"?: string | null,"title"?: string,"travel_min"?: number | null,"trip_id"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "items_trip_id_fkey"
      columns: ["trip_id"]
isOneToOne: false
      referencedRelation: "trips"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"created_at": string,"diet": (string)[],"display_name": string,"handle": string,"id": string,"interests": (string)[],"morning": number | null,"noise": number | null,"onboarded_at": string | null,"pace": number | null,"spending": number | null,"temperature": number | null,"updated_at": string,"walking": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"created_at"?: string,"diet"?: (string)[],"display_name"?: string,"handle": string,"id": string,"interests"?: (string)[],"morning"?: number | null,"noise"?: number | null,"onboarded_at"?: string | null,"pace"?: number | null,"spending"?: number | null,"temperature"?: number | null,"updated_at"?: string,"walking"?: number | null
                  }
                  Update: {
                    "avatar_url"?: string | null,"created_at"?: string,"diet"?: (string)[],"display_name"?: string,"handle"?: string,"id"?: string,"interests"?: (string)[],"morning"?: number | null,"noise"?: number | null,"onboarded_at"?: string | null,"pace"?: number | null,"spending"?: number | null,"temperature"?: number | null,"updated_at"?: string,"walking"?: number | null
                  }
                  Relationships: [
                    
                  ]
                },"reactions": {
                  Row: {
                    "item_id": string,"rsvp": string | null,"trip_id": string,"updated_at": string,"user_id": string,"vote": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "item_id": string,"rsvp"?: string | null,"trip_id": string,"updated_at"?: string,"user_id"?: string,"vote"?: string | null
                  }
                  Update: {
                    "item_id"?: string,"rsvp"?: string | null,"trip_id"?: string,"updated_at"?: string,"user_id"?: string,"vote"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "reactions_item_id_trip_id_fkey"
      columns: ["item_id","trip_id"]
isOneToOne: false
      referencedRelation: "items"
      referencedColumns: ["id","trip_id"]
    },{
      foreignKeyName: "reactions_profile_fk"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"trip_dogs": {
                  Row: {
                    "added_at": string,"added_by": string | null,"dog_id": string,"trip_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "added_at"?: string,"added_by"?: string | null,"dog_id": string,"trip_id": string
                  }
                  Update: {
                    "added_at"?: string,"added_by"?: string | null,"dog_id"?: string,"trip_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trip_dogs_dog_id_fkey"
      columns: ["dog_id"]
isOneToOne: false
      referencedRelation: "dogs"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_dogs_trip_id_fkey"
      columns: ["trip_id"]
isOneToOne: false
      referencedRelation: "trips"
      referencedColumns: ["id"]
    }
                  ]
                },"trip_members": {
                  Row: {
                    "joined_at": string,"trip_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "joined_at"?: string,"trip_id": string,"user_id": string
                  }
                  Update: {
                    "joined_at"?: string,"trip_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trip_members_profile_fk"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_members_trip_id_fkey"
      columns: ["trip_id"]
isOneToOne: false
      referencedRelation: "trips"
      referencedColumns: ["id"]
    }
                  ]
                },"trips": {
                  Row: {
                    "budget": string | null,"created_at": string,"creator_id": string,"dist": number,"end_date": string,"filters": (string)[],"id": string,"interests": (string)[],"invite_code": string,"invite_expires": string,"lat": number | null,"lon": number | null,"name": string,"pace": string | null,"place": string,"start_date": string,"status": string,"tz": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "budget"?: string | null,"created_at"?: string,"creator_id"?: string,"dist"?: number,"end_date": string,"filters"?: (string)[],"id"?: string,"interests"?: (string)[],"invite_code"?: string,"invite_expires"?: string,"lat"?: number | null,"lon"?: number | null,"name": string,"pace"?: string | null,"place"?: string,"start_date": string,"status"?: string,"tz"?: string,"updated_at"?: string
                  }
                  Update: {
                    "budget"?: string | null,"created_at"?: string,"creator_id"?: string,"dist"?: number,"end_date"?: string,"filters"?: (string)[],"id"?: string,"interests"?: (string)[],"invite_code"?: string,"invite_expires"?: string,"lat"?: number | null,"lon"?: number | null,"name"?: string,"pace"?: string | null,"place"?: string,"start_date"?: string,"status"?: string,"tz"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trips_creator_profile_fk"
      columns: ["creator_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"user_settings": {
                  Row: {
                    "id": string,"lang": string,"last_budget": string | null,"last_pace": string | null,"temp_unit": string,"theme": string,"time_format": string,"updated_at": string,"weight_unit": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id": string,"lang"?: string,"last_budget"?: string | null,"last_pace"?: string | null,"temp_unit"?: string,"theme"?: string,"time_format"?: string,"updated_at"?: string,"weight_unit"?: string
                  }
                  Update: {
                    "id"?: string,"lang"?: string,"last_budget"?: string | null,"last_pace"?: string | null,"temp_unit"?: string,"theme"?: string,"time_format"?: string,"updated_at"?: string,"weight_unit"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "add_buddies_to_trip":
{ Args: { "p_buddies": (string)[],"p_dogs"?: boolean,"p_trip": string }; Returns: number
                           },
"create_family":
{ Args: { "p_name": string }; Returns: string
                           },
"find_buddy":
{ Args: { "p_handle": string }; Returns: {
              "avatar_url": string,"display_name": string,"handle": string,"id": string,"relation": string
            }[]
                           },
"find_friend_profile":
{ Args: { "p_handle": string }; Returns: {
              "avatar_url": string,"display_name": string,"dogs": Json,"handle": string,"id": string,"interests": (string)[],"relation": string
            }[]
                           },
"handle_available":
{ Args: { "p_handle": string }; Returns: boolean
                           },
"invite_to_family":
{ Args: { "p_user": string }; Returns: undefined
                           },
"is_accepted_buddy":
{ Args: { "uid": string }; Returns: boolean
                           },
"is_buddy_of":
{ Args: { "uid": string }; Returns: boolean
                           },
"is_family_mate":
{ Args: { "uid": string }; Returns: boolean
                           },
"is_family_visible":
{ Args: { "fid": string }; Returns: boolean
                           },
"is_trip_leader":
{ Args: { "tid": string }; Returns: boolean
                           },
"is_trip_member":
{ Args: { "tid": string }; Returns: boolean
                           },
"join_family":
{ Args: { "p_code": string }; Returns: string
                           },
"join_trip":
{ Args: { "p_code": string }; Returns: string
                           },
"leave_family":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"make_handle":
{ Args: { "base": string }; Returns: string
                           },
"move_trip":
{ Args: { "p_end": string,"p_start": string,"p_trip": string }; Returns: number
                           },
"my_family_id":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"new_invite_code":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"peek_family":
{ Args: { "p_code": string }; Returns: Json
                           },
"peek_trip":
{ Args: { "p_code": string }; Returns: Json
                           },
"remove_family_member":
{ Args: { "p_user": string }; Returns: undefined
                           },
"rename_family":
{ Args: { "p_name": string }; Returns: undefined
                           },
"request_buddy":
{ Args: { "p_handle": string }; Returns: undefined
                           },
"respond_buddy":
{ Args: { "p_accept": boolean,"p_from": string }; Returns: undefined
                           },
"respond_buddy_relation":
{ Args: { "p_accept": boolean,"p_other": string }; Returns: undefined
                           },
"respond_family_invite":
{ Args: { "p_accept": boolean,"p_family": string }; Returns: undefined
                           },
"rotate_family_code":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"rotate_invite_code":
{ Args: { "p_trip": string }; Returns: string
                           },
"set_buddy_relation":
{ Args: { "p_other": string,"p_relation": string }; Returns: undefined
                           },
"shares_trip_with":
{ Args: { "uid": string }; Returns: boolean
                           },
"withdraw_buddy_relation":
{ Args: { "p_other": string }; Returns: undefined
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
