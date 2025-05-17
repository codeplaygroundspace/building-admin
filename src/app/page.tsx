import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function RootPage() {
  const session = await getSession();

  // If the user is not logged in, redirect to login
  if (!session) {
    redirect("/login");
  }

  // If logged in, redirect to the apartments page
  redirect("/apartamentos");
}
