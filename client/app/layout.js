"use client"

import './globals.css'
import {SessionProvider} from 'next-auth/react'
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({children, session}) {
    return (
        <html lang="id">
        <body>
        <SessionProvider session={session}>
            <CssBaseline/>
            {children}
        </SessionProvider>
        </body>
        </html>
    )
}
