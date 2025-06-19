import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authAdmin = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.role === "admin";

  if (isAdmin) {
    return next();
  }

  throw new ApiError(403, "You are not authorized");
});

export default authAdmin;
