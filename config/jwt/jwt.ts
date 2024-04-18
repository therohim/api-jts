import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export interface UserToken {
  userName: string;
}

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}

export const generate = async(user: UserToken) =>{
  const secret = process.env.JWT_TOKEN || "your-secret-key-here";

  const token = jwt.sign({ username: user.userName }, secret, {
    expiresIn: '2 days',
  });

  return token
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
 try {
  const secret = process.env.JWT_TOKEN || "your-secret-key-here";
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new Error();
  }

  const decoded = jwt.verify(token, secret);
  (req as CustomRequest).token = decoded;

  next();
 } catch (err) {
  return res.status(401).json({status:401,message:'Unauthorized'})
 }
};