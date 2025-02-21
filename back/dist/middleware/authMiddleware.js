"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// interface AuthenticatedRequest extends Request {
//   user?: {
//     id: string;
//     username: string;
//   };
// }
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token)
        return res.status(401).json({ error: "Access denied" });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};
exports.default = authenticateToken;
