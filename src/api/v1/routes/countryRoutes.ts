import express, { Router } from "express";
import * as countryController from "../controllers/countryController";
// import authenticate from "../middleware/authenticate";
// import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post("/", countryController.createCountry);
router.get("/", countryController.getCountry);
router.put("/:id", countryController.updateCountry);
router.delete("/:id", countryController.deleteCountry);

export default router;