import express from "express"
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { candidates, deleteCandidate, registerCandidate, updateCandidate, voteCount, votecandidate } from "../controllers/candidate.controller.js";
const router = express.Router();

router.post("/register", verifyjwt, registerCandidate);
router.put("/update/:id", verifyjwt, updateCandidate);
router.delete("/delete/:id", verifyjwt, deleteCandidate);
router.get("/", verifyjwt, candidates);
router.post("/vote/:id", verifyjwt, votecandidate);
router.get("/vote/count", verifyjwt, voteCount);

export default router;