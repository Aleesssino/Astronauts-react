import express from "express";
import * as astronautsController from "../controllers/astronauts";

const router = express.Router();

router.get("/", astronautsController.getAstronauts);

router.get("/:astronautId", astronautsController.getAstronaut);

router.post("/", astronautsController.createAstronaut);

router.patch("/:astronautId", astronautsController.upadateAstronaut);

router.delete("/:astronautId", astronautsController.deleteAstronaut);

export default router;