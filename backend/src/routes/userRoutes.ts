import express, { Router } from 'express'
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware'
import adminMiddleware from '../middlewares/adminMiddleware'
const userRoutes: Router = express.Router()

userRoutes.post('/login', loginUser)
userRoutes.post('/', createUser)

userRoutes.get('/', authMiddleware, adminMiddleware, getAllUsers)

userRoutes.get('/:id', authMiddleware, getUserById)

userRoutes.put('/:id', authMiddleware, updateUser)

userRoutes.delete('/:id', authMiddleware, deleteUser)

export default userRoutes