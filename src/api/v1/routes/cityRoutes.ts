import express, { Router } from "express";
import cityController from "../controllers/cityController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post("/", cityController.createCountry);
router.get("/", cityController.getCountry);
router.put("/:id", cityController.updateCountry);
router.delete("/:id", cityController.deleteCountry);

export default router;