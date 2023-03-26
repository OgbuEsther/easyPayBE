import { Router } from "express";
import { HousePlan,FeesPlan,createTravelPlan } from "../../controller/staff/staffDashboard/createPlans";


const staffRoutes = Router()

staffRoutes.post("/houseplan/:staffId" , HousePlan)
staffRoutes.post("/investplan/:staffId" , createTravelPlan)
staffRoutes.post("/schoolplan/:staffId" , FeesPlan)

export default staffRoutes