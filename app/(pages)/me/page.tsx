"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getAvatars, getMe, updateAvatar } from "@/lib/api/user-account"
import { useAuthStore } from "@/providers/auth-store-providers"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"

export default function MePage() {
    const accessToken = useAuthStore(state => state.accessToken)
    const queryClient = useQueryClient()

    const avatars = useQuery({
        queryKey: ["avatars"],
        queryFn: ({ signal }) => {
            if (!accessToken) {
                throw new Error("로그인이 필요합니다.")
            }

            return getAvatars(accessToken, signal)
        },
        enabled: Boolean(accessToken),
        staleTime: 30_000,
        retry: false
    })

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

    const avatarMutation = useMutation({
        mutationFn: (AvatarId: number) => {
            if (!accessToken) {
                throw new Error("로그인이 필요합니다.")
            }

            return updateAvatar(accessToken, AvatarId)
        },
        onError: () => {
            alert("프로필 수정 실패했습니다.")
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["me"]
            })
        }
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

            <div className="space-y-2 rounded-lg border p-4 flex gap-6">
                <div>
                    <Avatar className="size-24">
                        <AvatarImage src={me.data.avatar?.src} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <p>회원ID : { me.data.id }</p>
                    <p>이메일 : { me.data.email }</p>
                    <p>닉네임 : { me.data.nickname }</p>
                </div>
               
            </div>

            <div className="flex gap-8">
                {
                    avatars.isPending && (
                        <div className="flex items-center justify-center">
                            <Spinner></Spinner>
                        </div>
                    )
                }
                {
                    avatars.data && avatars.data.map((avatarImage, i) => (
                        <div key={i} onClick={() => avatarMutation.mutate(avatarImage.id)}>
                        <Avatar className="size-24">
                            <AvatarImage src={avatarImage.src} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        </div>
                    ))
                }
                
            </div>
        </div>
    )
}