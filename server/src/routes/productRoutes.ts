import { Router } from "express";
import {  createProduct, editProduct, getBrands, getCategories, getProducts } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);

router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.put("/edit", editProduct);

export default router;
