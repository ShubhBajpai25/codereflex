"use client"

import { signIn } from "~/auth"
import {login, logout} from "~/lib/actions/auth"

export default function Home() {

  return (
    <div>
      {" "}
      <h1>CodeReflex - Enhance your coding reflexes and stay at the top everyday.</h1>
      <p> You are not signed in. </p> 
      <button onClick={() => login()}> Sign in with Google</button>
      <button onClick={() => logout()}> Sign out</button>
    </div>
  )

}