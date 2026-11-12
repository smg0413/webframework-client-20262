import { AvatarResponse } from "./user"

export type ChatResponse = {
    userAccountId: number
    nickname: string
    content: string
    sentAt: string
    avatar: AvatarResponse | null
}