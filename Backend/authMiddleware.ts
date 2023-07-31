import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const jwtSecret = 'mostSecureSecretinTheWorld!!!';

interface UserData {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(' ')[1];
  
      try {
        const user = jwt.verify(token, jwtSecret) as UserData;
        req.user = user;
        next();
      } catch (err) {
        return res.sendStatus(403);
      }
    } else {
      res.sendStatus(401);
    }
  };

export default authenticateJWT;
