"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const express_1 = require("express");
const jwt_1 = require("../utils/jwt");
function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ message: 'Token nao informado.' });
    }
    const [scheme, token] = authHeader.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
        return response.status(401).json({ message: 'Token invalido.' });
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        const subject = typeof payload === 'string' ? payload : payload.sub;
        if (!subject) {
            return response.status(401).json({ message: 'Token invalido.' });
        }
        request.userId = subject;
        return next();
    }
    catch (error) {
        return response.status(401).json({ message: 'Nao autorizado.' });
    }
}
//# sourceMappingURL=ensureAuthenticated.js.map