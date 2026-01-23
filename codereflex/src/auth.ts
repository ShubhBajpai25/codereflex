import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [Google]
})