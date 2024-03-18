import { Candidate } from "../models/candidate.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkIfAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (user.role == "admin") {
    return true;
  }
  return false;
};

const addCandidate = asyncHandler(async (req, res) => {
  if (!(await checkIfAdmin(req.user._id))) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "user does not have access"));
  }

  const { name, party, age } = req.body;

  if ([name, party].some((field) => field?.trim() === " ") || isNaN(age)) {
    throw new ApiError(404, "All crediantials are not given");
  }

  const candidate = await Candidate.create({
    name,
    party,
    age,
  });

  if (!candidate) {
    throw new ApiError(
      500,
      "Something went wrong while registering the candidate"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, candidate, "candidate created successfully"));
});

const getCandidateById = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;
  const candidate = await Candidate.findById(candidateId);

  return res
    .status(200)
    .json(new ApiResponse(201, candidate, "candidate get sucessfully"));
});

const updateCandidate = asyncHandler(async (req, res) => {
  const { name, age, party } = req.body;
  //   if (!name || !age || !party) {
  //     throw new ApiError(400, "update details required");
  //   }
  if (
    !(
      !isNaN(age) ||
      !(!name || name?.trim() === "") ||
      !(!party || party?.trim() === "")
    )
  ) {
    throw new ApiError(400, "update fields are required");
  }

  const { candidateId } = req.params;
  const updatedCandidate = await Candidate.findByIdAndUpdate(
    candidateId,
    {
      name,
      age,
      party,
    },
    { new: true }
  );

  if (!updateCandidate) {
    throw new ApiError(400, "cannot update candidate");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCandidate, "updated Successfully"));
});

const deleteCandidate = asyncHandler(async (req, res) => {
  if (!(await checkIfAdmin(req.user._id))) {
    return res.staus(400, "does not has acess to delete");
  }
  const { candidateId } = req.params;
  const response = await Candidate.findByIdAndDelete(candidateId);
  if (!response) {
    throw new ApiError(400, "server Error");
  }
  return res.status(200).json(new ApiResponse(200, {}, "Delted Successfully"));
});

export { addCandidate, getCandidateById, updateCandidate, deleteCandidate };
