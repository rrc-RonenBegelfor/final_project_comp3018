import express, { Router } from "express";
import continentController from "../controllers/continentController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post("/", continentController.createContinent);
router.get("/", continentController.getContinent);
router.put("/:id", continentController.updateContinent);
router.delete("/:id", continentController.deleteContinent);

export default router;