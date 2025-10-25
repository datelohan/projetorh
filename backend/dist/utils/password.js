"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const HASH_ROUNDS = 10;
function hashPassword(plainPassword) {
    return bcryptjs_1.default.hash(plainPassword, HASH_ROUNDS);
}
function comparePassword(plainPassword, hashedPassword) {
    return bcryptjs_1.default.compare(plainPassword, hashedPassword);
}
//# sourceMappingURL=password.js.map