import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { Dashboard } from "./_components/dashboard"; // Move your UI code here

export default async function HomePage() {
  const session = await auth();

  // Protect the route: if no session, go to login
  if (!session) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <Dashboard user={session.user} />
    </HydrateClient>
  );
}