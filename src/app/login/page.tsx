import React from 'react'
import Gurfateh from '@/components/gurfateh/Gurfateh'
import SignIn from '@/components/signin/SignIn'

export default function Login() {
  return (
    <section className="flex flex-row w-full min-h-screen items-center justify-between gap-5 p-12 absolute">
      <Gurfateh />
      <SignIn />
    </section>
  )
}
