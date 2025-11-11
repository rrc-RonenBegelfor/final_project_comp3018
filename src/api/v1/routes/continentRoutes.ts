import express, { Router } from "express";
import continentController from "../controllers/continentController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post("/", continentController.createCountry);
router.get("/", continentController.getCountry);
router.put("/:id", continentController.updateCountry);
router.delete("/:id", continentController.deleteCountry);