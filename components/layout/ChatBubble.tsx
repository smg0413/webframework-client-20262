import { ChatResponse } from "@/types/chat"
import { formatTime } from "@/lib/formatTime"

type ChatBubbleProps = {
    message: ChatResponse
    isMine: boolean
}

export default function ChatBubble({ message, isMine }: ChatBubbleProps) {
    if (isMine) {
        return (
            <div className="flex items-end justify-end gap-2">
                <div className="shrink-0 text-xs"> {formatTime(message.sentAt)} </div>
                <div className="max-w-lg rounded-lg bg-white px-4 py-2 wrap-break-word">
                    {message.content}
                </div>
            </div>
        )
    }

    return (
        <div className="flex">
            <div className="size-20 shrink-0 rounded-full bg-amber-200"></div>
            <div className="min-w-0 pl-4">
                <div className="text-sm"> {message.nickname} </div>
                <div className="flex">
                    <div className="max-w-lg rounded-lg bg-orange-200 px-4 py-2 wrap-break-word">
                        {message.content}
                    </div>
                    <div className="flex w-20 shrink-0 items-end pl-2 text-xs">
                        {formatTime(message.sentAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}