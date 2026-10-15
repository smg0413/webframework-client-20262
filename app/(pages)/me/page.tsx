"use client"

import { Button } from "@/components/ui/button"
import { getMe } from "@/lib/api/user-account"
import { useAuthStore } from "@/providers/auth-store-providers"
import { MeResult } from "@/types/user"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

export default function MePage() {
    const accessToken = useAuthStore(state => state.accessToken)
    const [ result ] = useState<MeResult | null>(null)

    const me = useQuery({
        queryKey: ["me"],
        queryFn: ({signal}) => {
            if (!accessToken) {
                throw new Error("로그인이 필요합니다.")
            }

            return getMe(accessToken, signal)
        },
        enabled: Boolean(accessToken),
        staleTime: 30_000,//30초        // 30_000 = 30 * 1000와 같다(30초)
        retry: false
    })

    if (!accessToken) {
        return (
            <div>
                <Link href="/login"> 로그인으로 이동하기 </Link>
            </div>
        )
    }

    if (me.isPending) {
        return (
            <div> 내 정보 불러오는 중... </div>
        )
    }

    if (me.isError) {
        return (
            <div>
                <div> {me.error.message} </div>
                <Button onClick={() => me.refetch() }> 다시 조회 </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold"> 내 정보 </h1>

            <div className="space-y-2 rounded-lg border p-6">
                <p>회원ID : { me.data.id }</p>
                <p>이메일 : { me.data.email }</p>
                <p>닉네임 : { me.data.nickname }</p>
            </div>
        </div>
    )
}