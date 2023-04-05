import { Router } from "express";
import {
  getAllStaff,
  getOneStaff,
  staffSignin,
  staffSignup,
  updateStaff,
} from "../../controller/staff/staffAuthController";

const staffAuthRoutes = Router();

staffAuthRoutes.post("/stafflogin", staffSignin);
staffAuthRoutes.post("/staffregister", staffSignup);
staffAuthRoutes.get("/allstaff/", getAllStaff);
staffAuthRoutes.get("/staff/:staffId", getOneStaff);
staffAuthRoutes.patch("/updateStaff/:staffId", updateStaff);

export default staffAuthRoutes;
