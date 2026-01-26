import {auth} from "~/server/auth";
import {api, HydrateClient} from "~/trpc/server";
import { AuthButtons } from "./_components/auth-buttons";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
        <main className="p-8">
          <h1 className="text-2xl font-bold">CodeReflex</h1>
          <p className="mb-4">Enhance your code reflexes day by day</p>

          {session ? (
            <p>Welcome back, {session.user?.name}!</p>
          ) : (
            <p>You are not signed in.</p>
          )}
        </main>

        <AuthButtons isSignedIn={!!session} />
    </HydrateClient>
  )
}