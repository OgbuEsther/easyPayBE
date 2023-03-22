import {Router} from "express"
import { MakeTransfer, sendPayMinusPlan } from "../../controller/admin/admindashboard/adminWalletLogics"

const AdminRoutes = Router()

AdminRoutes.post("/paysalary/:UserId/:WalletID", MakeTransfer)
AdminRoutes.post("/paysalarywithhouseplan/:UserId/:WalletID", sendPayMinusPlan)

export default AdminRoutes
