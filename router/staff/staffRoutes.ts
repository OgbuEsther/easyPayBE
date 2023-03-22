import { Router } from "express";
import { HousePlan } from "../../controller/staff/staffDashboard/createPlans";


const staffRoutes = Router()

staffRoutes.post("/houseplan/:staffId" , HousePlan)

export default staffRoutes