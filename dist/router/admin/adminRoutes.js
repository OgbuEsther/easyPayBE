"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminWalletLogics_1 = require("../../controller/admin/admindashboard/adminWalletLogics");
const AdminRoutes = (0, express_1.Router)();
AdminRoutes.post("/paysalary/:UserId/:WalletID", adminWalletLogics_1.MakeTransfer);
AdminRoutes.post("/paysalarywithhouseplan/:userId/:walletID/:planId", adminWalletLogics_1.staffWithPlans);
AdminRoutes.post("/fundwallet/:userId/:walletId", adminWalletLogics_1.fundWalletFromBank);
AdminRoutes.route("/pay/:id").patch(adminWalletLogics_1.payInToWallet);
AdminRoutes.route("/pay-out/:id").post(adminWalletLogics_1.checkOutToBank);
exports.default = AdminRoutes;