"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatResponse } from "@/types/chat"
import { useEffect, useState, useRef } from "react"
import { Client } from "@stomp/stompjs"
import { useAuthStore } from "@/providers/auth-store-providers"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/lib/api/user-account"
import { ChatMessage } from "@/components/chat/chatMessage"




export default function ChatPage() {
    const accessToken = useAuthStore(state => state.accessToken)

    const messageListRef = useRef<HTMLDivElement>(null)

    const clientRef = useRef<Client | null>(null)
    const [ content, setContent] = useState("")
    const [ messages, setMessages] = useState<ChatResponse[]>([])

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

    const myId = me.data?.id

    useEffect(() => {
        const element = messageListRef.current

        if (!element) {
            return
        }

        element.scroll({
            top: element.scrollHeight,
            behavior: "smooth"
        })

    }, [messages, myId])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws-chat",
            connectHeaders: {
                Authorization : `Bearer ${accessToken}`
            },
            reconnectDelay: 0,  // 이번에는 일단 재연결 사용 않함.
            onConnect: () => {
                console.log('STOMP 연결')
                client.subscribe("/topic/chat", (message) => {
                    const data: ChatResponse = JSON.parse(message.body)

                    setMessages((prev) => [...prev, data])
                })
            },
            onStompError: (frame) => {
                console.error("SROMP 오류 : ", frame.headers["message"], frame.body)
            },
            onWebSocketError: (event) => {

            }
        }, )

        clientRef.current = client
        client.activate()

        return () => {
            clientRef.current = null
            void client.deactivate()
        }
    }, [ accessToken ])

    function sendMessage() {
        const client = clientRef.current
        const message = content.trim()

        if (!client?.connected) {
            alert("채팅 서버 연결이 되지 않았습니다.")
            return
        }

        client.publish({
            destination: "/app/chat.send",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                content: message
            })
        })

        setContent("")
    }


    if (!accessToken) {
        return (
            <div>
                <p> 로그인 후 채팅에 참여할 수 있습니다. </p>
                <Link href={"/login"}>
                    <Button> 로그인으로 이동 </Button>
                </Link>

            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="text-2xl font-bold">채팅</div>

            <div ref={messageListRef} className="h-[600px] space-y-4 overflow-y-auto rounded-lg border p-4 bg-blue-50">
    {
        messages.map((message, i) => (
            <ChatMessage key={i} message={message} isMine={message.userAccountId === myId}/>
        ))
    }
</div>

            <form className="flex gap-2"
                onSubmit={(event) => {
                    event.preventDefault()
                    sendMessage()
                }}
            >
                <Input
                value={content} placeholder="메세지를 입력하세요." maxLength={500}
                onChange={(event) => setContent(event.target.value)}
                ></Input>
                <Button type="submit" disabled={!content.trim()} > 전송 </Button>
            </form>

        </div>
    )

}
