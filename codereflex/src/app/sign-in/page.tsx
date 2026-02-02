import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { LandingPage } from "../_components/landing_page"; // Move your UI code here

export default async function SignInPage() {
  const session = await auth();

  // If already logged in, they don't need to see the landing page
  if (session) {
    redirect("/");
  }

  return <LandingPage />;
}