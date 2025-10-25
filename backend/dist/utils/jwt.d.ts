import jwt from 'jsonwebtoken';
export declare function signToken(userId: string): never;
export declare function verifyToken(token: string): string | jwt.JwtPayload;
export type JwtPayload = jwt.JwtPayload | string;
//# sourceMappingURL=jwt.d.ts.map