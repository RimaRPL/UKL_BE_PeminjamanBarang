import { Router } from "express";
import { verifyToken } from "../MIDDLEWARE/authorization";
import { createInventory, readInventoryById, updateInventory, deleteInventory} from "../CONTROLLER/inventoryController";
import { createValidation, updateValidation } from "../MIDDLEWARE/inventoryValidation";
import authorizeAdmin from "../MIDDLEWARE/authorizeAdmin";

const router = Router()

router.post('/', [verifyToken, authorizeAdmin, createValidation], createInventory)
router.get('/:id?', [verifyToken], readInventoryById)
router.put('/:id', [verifyToken, authorizeAdmin, updateValidation], updateInventory)
router.delete('/:id', [verifyToken, authorizeAdmin], deleteInventory)

export default router