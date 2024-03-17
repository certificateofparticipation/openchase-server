import jwt from "jsonwebtoken"
import {JWTSecret} from "../app"
import {Request} from "express";
import {JWTToken} from "./models";

export function stripBearer(header: string): string {
    return header.replace("Bearer ", "")
}

export async function verifyJWT(token: string): Promise<JWTToken> {
    return new Promise<JWTToken>((res, rej) => {
        jwt.verify(token, JWTSecret, (err, decoded) => {
            if (err) {
                rej()
            } else {
                let decodedToken = decoded as JWTToken
                res(decodedToken)
            }
        })
    })
}

export async function getHeaders(req: Request, ...headers: string[]): Promise<string[]> {
    return new Promise<string[]>((res, rej) => {
        let values: string[] = []
        headers.forEach((header) => {
            let result: string | undefined = req.get(header)
            if (result == undefined) {
                rej(header)
            } else {
                values.push(result)
            }
        })
        res(values)
    })

}

export async function verifyAuthorization(req: Request): Promise<JWTToken> {
    return new Promise<JWTToken>((resolve, reject) => {
        getHeaders(req, "Authorization").then(([token]) => {
            token = stripBearer(token)
            verifyJWT(token).then((jwtToken) => {
                resolve(jwtToken)
            }).catch(() => {
                reject(403)
            })
        }).catch(() => {
            reject(400)
        })
    })
}