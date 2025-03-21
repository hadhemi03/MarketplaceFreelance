import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }
  
    console.log("Token received:", token); // Log token for debugging
  
    jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
      if (err) {
        console.error("Error verifying token:", err); // Log detailed error
        return next(createError(403, "Token is not valid!"));
      }
      console.log("Decoded user:", user); // Log the decoded user object
      req.user = { _id: user.userId, role: user.role };  // Attach user object to request
      next();
    });
};





// ✅ Only Clients can access
export const verifyClient = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "client") {
            next();
        } else {
            return next(createError(403, "Only clients are authorized!"));
        }
    });
};

// ✅ Only Freelancers can access
export const verifyFreelancer = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "freelancer") {
            next();
        } else {
            return next(createError(403, "Only freelancers are authorized!"));
        }
    });
};

// ✅ Only Admins can access
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next();
        } else {
            return next(createError(403, "Only admins are authorized!"));
        }
    });
};

// ✅ Custom role-based verification
export const verifyRole = (role) => {
    return (req, res, next) => {
        verifyToken(req, res, () => {
            if (req.user.role === role) {
                next();
            } else {
                return next(createError(403, `Only ${role}s are authorized!`));
            }
        });
    };
};
