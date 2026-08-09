import jwt from 'jsonwebtoken'
import { env } from '../config/env.ts'

export const getToken = (id: string | number) => jwt.sign({ id: id }, env.jwtSecret, { expiresIn: 60 * 60 * 24 })

export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret)

    } catch {
        return undefined
    }
}
