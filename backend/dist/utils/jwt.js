"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
function signToken(userId) {
    return jsonwebtoken_1.default.sign({}, auth_1.jwtConfig.secret, {
        subject: userId,
        expiresIn: auth_1.jwtConfig.expiresIn,
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, auth_1.jwtConfig.secret);
}
//# sourceMappingURL=jwt.js.map