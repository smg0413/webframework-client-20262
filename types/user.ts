export type MeResponse = {
    id: number
    email: string
    nickname: string
}

 export type MeResult = {
    token: string
    data: MeResponse | null
    error?: string
}

export type LoginResponse = {
    accessToken: string
    tokenType: string
    expiersIn: number
}   

export type LoginRequest = {
    email: string
    password: string
}