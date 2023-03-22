import { Router } from "express";
import {
  getAllStaff,
  getOneStaff,
  staffSignin,
  staffSignup,
} from "../../controller/staff/staffAuthController";

const staffAuthRoutes = Router();

staffAuthRoutes.post("/stafflogin", staffSignin);
staffAuthRoutes.post("/staffregister", staffSignup);
staffAuthRoutes.get("/ ", getAllStaff);
staffAuthRoutes.get("/staff/:staffId", getOneStaff);
export default staffAuthRoutes;
