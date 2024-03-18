import { Router } from "express";
import {
  addCandidate,
  deleteCandidate,
  getCandidateById,
  updateCandidate,
} from "../controllers/candidate.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/add-candidate").post(addCandidate);
router
  .route("/:candidateId")
  .get(getCandidateById)
  .patch(updateCandidate)
  .delete(deleteCandidate);

export default router;
