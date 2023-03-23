import { Router } from "express";
import { HousePlan } from "../../controller/staff/staffDashboard/createPlans";


const staffRoutes = Router()

staffRoutes.post("/houseplan/:staffId" , HousePlan)
staffRoutes.post("/investplan/:staffId" , HousePlan)
staffRoutes.post("/schoolplan/:staffId" , HousePlan)

export default staffRoutes