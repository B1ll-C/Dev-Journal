import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient"; // Client component
import { getSessionOrRedirect } from "@/utils/supabase/getSessionOrRedirect";

export default async function DashboardPage() {
  // const supabase = createClient();

  // // Get user session on the server
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/login"); // Redirect if not logged in
  // }

  // Optionally fetch user data here
  const session = await getSessionOrRedirect();
  return <DashboardClient user={session.user} />;
}
