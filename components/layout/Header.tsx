"use client"

import { useAuthStore } from "@/providers/auth-store-providers"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { useQueryClient } from "@tanstack/react-query"

export default function Header() {
    const queryClient = useQueryClient()
    
    const { accessToken, isHydrated, clearAccessToken} = useAuthStore(state => state)
    const handleLogout = async function() {
        await queryClient.cancelQueries({queryKey: ["me"]})
        queryClient.removeQueries({queryKey: ["me"]})

        clearAccessToken()
    }

    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2">
                <Link href="/" className="font-bold"> 웹프레임워크 </Link>
                
                <nav className="flex items-center gap-2">
                    {
                        !isHydrated? <></> :(
                          accessToken? (
                           <>
                           <Link href="/me" className={buttonVariants()}> 내 정보</Link>
                            <Button onClick={handleLogout}>
                                로그아웃
                            </Button>
                            </>
                        ):(
                            <>
                            <Link href="/signup" className={buttonVariants({ variant: "ghost"})}> 회원가입 </Link>
                            <Link href="/login" className={buttonVariants()}> 로그인 </Link>
                            </>
                            )
                        )
                    }

                </nav>
            </div>
        </header>
    )
}