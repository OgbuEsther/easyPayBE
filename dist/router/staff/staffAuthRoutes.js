"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffAuthController_1 = require("../../controller/staff/staffAuthController");
const staffAuthRoutes = (0, express_1.Router)();
staffAuthRoutes.post("/stafflogin", staffAuthController_1.staffSignin);
staffAuthRoutes.post("/staffregister", staffAuthController_1.staffSignup);
staffAuthRoutes.get("/ ", staffAuthController_1.getAllStaff);
staffAuthRoutes.get("/staff/:staffId", staffAuthController_1.getOneStaff);
exports.default = staffAuthRoutes;