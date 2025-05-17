import { redirect } from "next/navigation";

export default function AuthenticatedRootPage() {
  // Redirect to dashboard as the main entry point
  redirect("/dashboard");
}
