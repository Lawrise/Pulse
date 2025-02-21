"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const nmodels_1 = require("../nmodels");
const core_1 = require("@sequelize/core");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwtconf_1 = require("../config/jwtconf");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const userExists = yield nmodels_1.User.findOne({
            where: {
                [core_1.Op.or]: [{ email }, { username }],
            },
        });
        if (userExists) {
            return res.status(400).json({
                error: `User with this ${userExists.email === email ? "email" : "username"} already exists`,
            });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const user = yield nmodels_1.User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifiant, password } = req.body;
        if (!identifiant || !password) {
            return res
                .status(400)
                .json({ error: "Email/Username and password are required" });
        }
        const user = yield nmodels_1.User.findOne({
            where: {
                [core_1.Op.or]: [{ email: identifiant }, { username: identifiant }],
            },
        });
        if (!user || !(yield (0, bcrypt_1.compare)(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = (0, jsonwebtoken_1.sign)({
            id: user.id,
            username: user.username,
        }, jwtconf_1.JWT_SECRET, { expiresIn: "24h" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequest = req;
    if (!userRequest.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const user = yield nmodels_1.User.findByPk(userRequest.user.id, {
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getProfile = getProfile;
