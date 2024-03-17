export interface JWTToken {
    name: string
    admin: boolean
}

export interface User {
    name: string
    hash: string
    admin: boolean
}