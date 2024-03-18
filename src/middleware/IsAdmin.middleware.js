import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const IsAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role == "voter") {
      return res.status(400).json(new ApiResponse(400, "You are not an admin"));
    }
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});
