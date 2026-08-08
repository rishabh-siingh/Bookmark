import type { Database } from "@/types/database";
import type { Item } from "@/types";

type Row = Database["public"]["Tables"]["items"]["Row"];

export function rowToItem(row: Row): Item {
  return {
    id: row.id,
    userId: row.user_id,
    parentId: row.parent_id,
    type: row.type,
    name: row.name,
    url: row.url,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
