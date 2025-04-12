import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    // Try from cookie
    let token = req.cookies.access_token;
  
    // Try from Authorization header if not in cookie
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
  
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }
  
    jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
      if (err) {
        return next(createError(403, "Token is not valid!"));
      }
  
      req.user = { _id: decoded.userId || decoded.id, role: decoded.role }; // adapt to your token payload
      next();
    });
  };




// Only Clients can access
export const verifyClient = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "client") {
            next();
        } else {
            return next(createError(403, "Only clients are authorized!"));
        }
    });
};

//  Only Freelancers can access
export const verifyFreelancer = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "freelancer") {
            next();
        } else {
            return next(createError(403, "Only freelancers are authorized!"));
        }
    });
};

//  Only Admins can access
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

// only client and admin can access
export const verifyClientOrAdmin = (req, res, next) => {
    if (req.user.role === 'client' || req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: "Access denied." });
    }
  };
