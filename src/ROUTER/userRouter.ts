import { Router } from "express";
import { createUser, readUser, updateUser, deleteUser, authentication } from "../CONTROLLER/userController";
import { authValidation, createValidation, updateValidation } from "../MIDDLEWARE/userValidation";
import { verifyToken } from "../MIDDLEWARE/authorization";

const router = Router()

router.post(`/`, [createValidation], createUser)
router.get(`/`, [verifyToken],readUser)
router.put(`/:id`, [verifyToken, updateValidation], updateUser)
router.delete(`/:id`, [verifyToken], deleteUser)
router.post(`/auth/login`, [authValidation], authentication)

export default router