import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getSessionOrRedirect() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
