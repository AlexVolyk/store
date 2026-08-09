import express from 'express'
import { allUsers, updateUser, deleteUser } from '../controllers/user.controllers.ts'
import { validateJWT } from '../middleware/validateJWT.middleware.ts'
import { updateUserSchema } from '../validators/user.validator.ts'
import { validateBody } from '../middleware/validate.middleware.ts'

const userRouter = express.Router()


userRouter.get(
    '/', 
    allUsers
)

userRouter.use(validateJWT)

userRouter.put(
    '/update/:id', 
    validateBody(updateUserSchema), 
    updateUser
)
userRouter.delete(
    '/delete/:id', 
    deleteUser
)



export {userRouter}