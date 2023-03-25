"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createPlans_1 = require("../../controller/staff/staffDashboard/createPlans");
const staffRoutes = (0, express_1.Router)();
staffRoutes.post("/houseplan/:staffId", createPlans_1.HousePlan);
staffRoutes.post("/investplan/:staffId", createPlans_1.investPlan);
staffRoutes.post("/schoolplan/:staffId", createPlans_1.FeesPlan);
exports.default = staffRoutes;
