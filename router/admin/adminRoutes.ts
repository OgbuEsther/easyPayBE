import {Router} from "express"
import { checkOutwithCard, fundWalletFromBank, MakeTransfer, staffWithPlans } from "../../controller/admin/admindashboard/adminWalletLogics"

const AdminRoutes = Router()

AdminRoutes.post("/paysalary/:UserId/:WalletID", MakeTransfer)
AdminRoutes.post("/paysalarywithhouseplan/:userId/:walletID/:planId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId",fundWalletFromBank )
AdminRoutes.route("/pay/:id/:id").post(checkOutwithCard);

export default AdminRoutes
