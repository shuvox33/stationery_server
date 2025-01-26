import jwt from 'jsonwebtoken';

export const createToken = (
  JwtPayload: { email: string; role: string; userId: string },
  expiresIn: string,
  secret: string,
) => {
  return jwt.sign(JwtPayload, secret, { expiresIn  } as jwt.SignOptions);
};

// import jwt, { JwtPayload } from 'jsonwebtoken';

// export const createToken = (
//   jwtPayload: { email: string; role: string },
//   secret: string,
//   expiresIn: string,
// ) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   } as jwt.SignOptions);
// };
// export const verifyToken = (token: string, secret: string) => {
//     return jwt.verify(token, secret) as JwtPayload;
// };
