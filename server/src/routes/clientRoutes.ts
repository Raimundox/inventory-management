import { Router } from "express";
import { createClient, deleteUser, editClient, getUsers } from "../controllers/clientController";

const router = Router();

router.get("/", getUsers);
router.post("/", createClient);

router.put("/edit", editClient);
router.delete("/delete", deleteUser);

export default router;
