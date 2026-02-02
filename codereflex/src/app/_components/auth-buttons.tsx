// src/app/_components/auth-buttons.tsx
"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

interface AuthButtonsProps {
  isSignedIn: boolean;
}

export function AuthButtons({ isSignedIn }: AuthButtonsProps) {
  if (isSignedIn) {
    return (
      <Button variant="outline" onClick={() => void signOut()}>
        Sign Out
      </Button>
    );
  }

  return (
    <Button 
      className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12 text-lg font-medium"
      // Force the redirect to /dashboard after Google login
      onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
    >
      Join the Community
    </Button>
  );
}