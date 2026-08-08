import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookmarkApp from "@/components/BookmarkApp";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <BookmarkApp userId={user.id} userEmail={user.email ?? ""} />;
}
