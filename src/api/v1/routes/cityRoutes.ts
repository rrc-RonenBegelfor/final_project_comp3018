import express, { Router } from "express";
import * as cityController from "../controllers/cityController";
// import authenticate from "../middleware/authenticate";
// import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post("/", cityController.createCity);
router.get("/", cityController.getCity);
router.put("/:id", cityController.updateCity);
router.delete("/:id", cityController.deleteCity);

export default router;