"use client"

import {Button} from '@mui/material'
import {useSession, signOut, getSession} from "next-auth/react";

export default function Home() {
    const {data: session, status} = useSession()
    if (status === "loading") return 'Loading...'
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-6xl font-bold">Selamat Datang {session?.user.name}</h1>
            <Button variant="contained" onClick={signOut}>Sign Out</Button>
        </main>
    )
}
