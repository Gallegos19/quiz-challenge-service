import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    // Solo verificamos que exista un token con formato Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No valid token provided" });
    }

    // For debugging purposes, set a mock user with a valid UUID
    // This will help identify if the issue is related to user authentication
    // req.user = {
    //   userId: "ac537f35-7eda-4e6d-a72f-4ca855299b63", // Valid UUID format
    //   role: "user",
    // };

    // No validamos el contenido del token, solo su existencia
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication error" });
  }
};
