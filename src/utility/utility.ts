import jwt from "jsonwebtoken"
import {JWTSecret} from "../app"

interface JWTToken {
    admin: boolean
}

export function stripBearer(header: string): string {
    return header.replace("Bearer ", "")
}

export async function verifyJWT(token: string): Promise<[boolean, boolean]> {
    return new Promise<[boolean, boolean]>((res, rej) => {
        jwt.verify(token, JWTSecret, (err, decoded) => {
            if (err) {
                res([false, false])
            } else {
                decoded = decoded as JWTToken
                res([true, decoded.admin])
            }
        })
    })
}