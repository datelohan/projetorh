"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicUser = toPublicUser;
function toPublicUser(user) {
    const { senhaHash, ...rest } = user;
    return rest;
}
//# sourceMappingURL=user.js.map