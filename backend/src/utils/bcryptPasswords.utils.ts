import bcrypt from 'bcrypt'
export const hashPassword = (password: string) => bcrypt.hashSync(password, 7) 

export const comparePasswords = (password: string, loginPassword: string)=> bcrypt.compare(password, loginPassword)