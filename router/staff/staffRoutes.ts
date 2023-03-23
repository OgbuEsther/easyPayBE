import { Router } from "express";
import { HousePlan,FeesPlan,investPlan } from "../../controller/staff/staffDashboard/createPlans";


const staffRoutes = Router()

staffRoutes.post("/houseplan/:staffId" , HousePlan)
staffRoutes.post("/investplan/:staffId" , investPlan)
staffRoutes.post("/schoolplan/:staffId" , FeesPlan)

export default staffRoutes