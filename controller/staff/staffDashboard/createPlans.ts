import staffAuth from "../../../model/staff/staffAuth";
import houseModel from "../../../model/staff/staffDashboard/StaffHouse";
import feesModel from "../../../model/staff/staffDashboard/staffFees";
import investModel from "../../../model/staff/staffDashboard/staffInvestment";
import mongoose from "mongoose"
import {Request , Response} from "express"

//create house plan 

export const HousePlan = async(req:Request , res:Response)=>{
    try {
        const {percentageRate ,totalBal, subscribe } = req.body
const getStaff = await staffAuth.findById(req.params.staffId)
        // const getStaff = 
        const createHousePlan = await houseModel.create({
            percentageRate ,totalBal, subscribe
        })
await getStaff?.houseRentPlan?.push(new mongoose.Types.ObjectId(createHousePlan?._id))
getStaff?.save()

        return res.status(201).json({
            message : "created house plan",
            data : createHousePlan
        })
    } catch (error:any) {
        return res.status(400).json({
            message : "an error occured",
            data : error.message,
            err: error
        })
    }
}
export const FeesPlan = async(req:Request , res:Response)=>{
    try {
        const {percentageRate ,totalBal, subscribe } = req.body

        // const getStaff = 
        const createFeesPlan = await feesModel.create({
            percentageRate ,totalBal, subscribe
        })

        return res.status(201).json({
            message : "created fees plan",
            data : createFeesPlan
        })
    } catch (error:any) {
        return res.status(400).json({
            message : "an error occured",
            data : error.message,
            err: error
        })
    }
}
export const investPlan = async(req:Request , res:Response)=>{
    try {
        const {percentageRate ,totalBal, subscribe } = req.body

        // const getStaff = 
        const createInvestPlan = await investModel.create({
            percentageRate ,totalBal, subscribe
        })

        return res.status(201).json({
            message : "created invest plan",
            data : createInvestPlan
        })
    } catch (error:any) {
        return res.status(400).json({
            message : "an error occured",
            data : error.message,
            err: error
        })
    }
}