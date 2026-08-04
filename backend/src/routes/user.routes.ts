import express from 'express'
import { allUsers, updateUser, deleteUser } from '../controllers/user.contollers.ts'
import { validateJWT } from '../middleware/validateJWT.middleware.ts'
const userRouter = express.Router()


userRouter.get('/', allUsers)
userRouter.put('/update/:id', validateJWT, updateUser)
userRouter.delete('/delete/:id',validateJWT, deleteUser)



export {userRouter}