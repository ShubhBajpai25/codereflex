import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { LandingPage } from "~/app/_components/landing_page";
import { Dashboard } from "~/app/_components/dashboard";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      {!session ? (
        <LandingPage />
      ) : (
        <Dashboard user={session.user} />
      )}
    </HydrateClient>
  );
}