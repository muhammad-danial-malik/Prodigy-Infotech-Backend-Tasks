import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const authorizeRole = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied: insufficient permissions");
    }
    next();
  });

export default authorizeRole;

Task 03: JWT-Based  Authentication & Authorization Implement authentication
and authorization  using JSON Web Tokens (JWT). 

• Add user registration and login endpoints. 
• Store hashed passwords using a library like bcrypt.
• On successful login, generate and return a JWT token to the client.
• Protect certain routes (e.g., /users or / profile) to be accessible
  only by authenticated users using the JWT token. 
• Implement role-based access control (e.g., admin, user, owner)
  to restrict access to specific endpoints.