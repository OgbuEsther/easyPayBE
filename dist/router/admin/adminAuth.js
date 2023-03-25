"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuthController_1 = require("../../controller/admin/adminAuthController");
const adminAuthRoutes = (0, express_1.Router)();
adminAuthRoutes.post("/login", adminAuthController_1.adminSignin);
adminAuthRoutes.post("/register", adminAuthController_1.adminSignup);
adminAuthRoutes.get("/", adminAuthController_1.getAllAdmin);
adminAuthRoutes.get("/:adminId", adminAuthController_1.getOneAdmin);
exports.default = adminAuthRoutes;
