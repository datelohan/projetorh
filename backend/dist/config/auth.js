"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}
exports.jwtConfig = {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
};
//# sourceMappingURL=auth.js.map