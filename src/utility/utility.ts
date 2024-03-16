import jwt from "jsonwebtoken"
import {JWTSecret} from "../app"
import {Request, Response} from "express";

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

export function getHeader(req: Request, res: Response, header: string, errorCode: number, errorMessage: string): string | null {
    let result = req.get(header)
    if (!result) {
        res.status(errorCode)
        res.send(errorMessage)
        return null
    }
    return result
}