import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../config/env.ts'

export interface UserTokenPayload extends JwtPayload {
    id: string
}

export const hasUserId = (payload: unknown): payload is UserTokenPayload => {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'id' in payload &&
        typeof (payload as Record<string, unknown>).id === 'string'
    )
}

export const getToken = (id: string | number) => {
    return jwt.sign({ id: String(id) }, env.jwtSecret, { expiresIn: 60 * 60 * 24 })
}

export const verifyToken = (token: string, secret = env.jwtSecret): UserTokenPayload | undefined => {
    try {
        const decoded = jwt.verify(token, secret)
        return hasUserId(decoded) ? decoded : undefined
    } catch {
        return undefined
    }
}
