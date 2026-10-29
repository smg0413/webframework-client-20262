"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatResponse } from "@/types/chat"
import { useEffect, useState, useRef } from "react"
import { Client } from "@stomp/stompjs"

export default function ChatPage() {
    const clientRef = useRef<Client | null>(null)
    const [ content, setContent] = useState("")
    const [ messages, setMessages] = useState<ChatResponse[]>([])
    
    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws-chat",
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
        },[])

        clientRef.current = client
        client.activate()

        return () => {
            clientRef.current = null
            void client.deactivate()
        }
    }, [])

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


    return (
        <div className="space-y-4">
            <div className="text-2xl font-bold">채팅</div>

            <ul className="h-64 space-y-2 overflow-y-auto rounded-lg border p-4">
                {
                    messages.map((message, i) => (
                        <li key={i} className="wrap-break-word">
                            {message.content}
                        </li>
                    ))

                }
            </ul>
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

// websocket 연결
// subscribe 성공
// publish 하면 subscribe한테 메세지가 즉시 나오는지.