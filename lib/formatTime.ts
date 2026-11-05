export function formatTime(sentAt: string): string {
    return new Date(sentAt).toLocaleTimeString("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
}