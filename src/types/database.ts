export type ItemType = "folder" | "bookmark";

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          user_id: string;
          parent_id: string | null;
          type: ItemType;
          name: string;
          url: string | null;
          icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parent_id?: string | null;
          type: ItemType;
          name: string;
          url?: string | null;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parent_id?: string | null;
          type?: ItemType;
          name?: string;
          url?: string | null;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
