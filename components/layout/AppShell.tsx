"use client"

import { ReactNode } from "react"
import Header from "./Header"
import { useAuthStore } from "@/providers/auth-store-providers"

type AppShellProps = {
    children: ReactNode
    sidePanel : ReactNode | null
}

export default function AppShell({ children, sidePanel = null }: AppShellProps) {
    const isHydrated = useAuthStore(state => state.isHydrated)

    if (!isHydrated) {
        return <></>
    }

    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <Header/>

        {
            sidePanel && (<div className="bg-white-100 w-[200px] h-[calc(100%-64px)] fixed top-16 border rounded-r-xl p-4">
                    <div className="font-semibold text-xl"> 제목 </div>
                    <div className="pt-4">
                        { sidePanel }
                    </div>
            </div>)
        }

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
                {children}
            </main>
        </div>
    )
}