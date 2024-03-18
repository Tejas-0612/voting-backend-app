import { Router } from "express";
import {
  addCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
} from "../controllers/candidate.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { IsAdmin } from "../middleware/IsAdmin.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllCandidates);

router.use(IsAdmin);

router.route("/add-candidate").post(addCandidate);
router
  .route("/:candidateId")
  .get(getCandidateById)
  .patch(updateCandidate)
  .delete(deleteCandidate);

export default router;
