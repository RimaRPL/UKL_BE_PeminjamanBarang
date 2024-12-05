import { Router } from "express";
import { verifyToken } from "../MIDDLEWARE/authorization";
import { createValidation, returnValidation, usageValidation } from "../MIDDLEWARE/borrowValidation";
import { analyzeItemUsage, analyzeUsage, createBorrow, returnItem } from "../CONTROLLER/borrowController";
import authorizeAdmin from "../MIDDLEWARE/authorizeAdmin";

const router = Router()

router.post(`/inventory/borrow`, [verifyToken, createValidation], createBorrow)
router.post(`/return`, [verifyToken, returnValidation], returnItem);
router.post(`/inventory/usage-report`, [verifyToken, authorizeAdmin, usageValidation], analyzeUsage)
router.post(`/inventory/borrow-analysis`, [verifyToken, authorizeAdmin], analyzeItemUsage);

export default router