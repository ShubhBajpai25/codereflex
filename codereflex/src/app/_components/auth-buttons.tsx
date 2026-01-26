"use client"

import {login, logout} from "~/lib/actions/auth";

export function AuthButtons({ isSignedIn }: { isSignedIn: boolean }) {
    return (
        <div className="flex gap-4">
            {!isSignedIn ? (
                <button onClick={() => login()} className="bg-blue-500 p-2 rounded">
                    Sign in with Google
                </button>
            ): (
                <button onClick={() => logout()} className="bg-blue-500 p-2 rounded">
                Sign Out 
                </button>
            )}
        </div>
    );
}