export type AvatarResponse = {
    id: number
    src: string
    bgColor: string
}

export type MeResponse = {
    id: number
    email: string
    nickname: string
    avatar: AvatarResponse | null
}

 export type MeResult = {
    token: string
    data: MeResponse | null
    error?: string
}

export type LoginResponse = {
    accessToken: string
    tokenType: string
    expiresIn: number
}   

export type LoginRequest = {
    email: string
    password: string
}

export type SignUpRequest = {
    email: string
    password: string
    nickname: string
}

export type SignUpResponse = {
    id: number
}

