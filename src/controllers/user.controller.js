import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefereshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    email,
    mobile,
    address,
    aadharCardNumber,
    password,
    role,
  } = req.body;

  if (
    [name, email, mobile, address, password, role].some(
      (field) => field?.trim() === ""
    ) ||
    isNaN(age) ||
    isNaN(aadharCardNumber)
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (role == "admin") {
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      throw new ApiError(400, "Admin already exists");
    }
  }

  if (!/^\d{12}$/.test(aadharCardNumber)) {
    throw new ApiError(400, "aadharCardNumber must contains 12 digits");
  }

  const existedUser = await User.findOne({ aadharCardNumber });

  if (existedUser) {
    throw new ApiError(
      400,
      "User is already exists with this aadharCard number"
    );
  }

  const user = await User.create({
    name,
    age,
    email,
    mobile,
    address,
    aadharCardNumber,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { aadharCardNumber, password } = req.body;

  if (!aadharCardNumber && !password) {
    throw new ApiError(400, "aadharCardNumber or password is missing");
  }

  const user = await User.findOne({ aadharCardNumber });
  if (!user) {
    throw new ApiError(404, "user does not exists");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user loggedOut sucessfully"));
});

const getprofile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "userData get successfully"));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(404, "old Password or new Password is missing");
  }

  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed sucessfully"));
});

export { registerUser, loginUser, logoutUser, getprofile, changeUserPassword };
