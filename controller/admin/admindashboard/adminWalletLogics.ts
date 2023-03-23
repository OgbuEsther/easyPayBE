import mongoose from "mongoose"
import staffAuth from "../../../model/staff/staffAuth"
import adminAuth from "../../../model/admin/adminAuth"
import express,{Request , Response} from "express"
import adminWalletModel from "../../../model/admin/admindashboard/adminWallets"
import adminTransactionHistory from "../../../model/admin/admindashboard/adminTransactionHistorys"
import staffTransactionHistory from "../../../model/staff/staffDashboard/stafftransactionHistorys"
import staffWalletModel from "../../../model/staff/staffDashboard/StaffWallet"
import houseModel from "../../../model/staff/staffDashboard/StaffHouse"

//admin transfer from wallet to staff wallet for staffs with no plans

export const MakeTransfer = async (req: Request, res: Response) => {
	try {
		const { walletNumber, amount } = req.body;
        const getDate = new Date().toDateString()

		const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;

		//RECIEVER ACCOUNT
		const getReciever = await staffAuth.findOne({ walletNumber });
		const getRecieverWallet = await staffWalletModel.findById(getReciever?._id);

		// SENDER ACCOUNT
		const getUser = await adminAuth.findById(req.params.UserId);
		const getUserWallet = await adminWalletModel.findById(req.params.WalletID);

		if (getUser && getReciever) {
			if (amount > getUserWallet?.balance!) {
				return res.status(404).json({
					message: "insufficent fund.",
				});
			} else {
				// undating the sender walllet
				await adminWalletModel.findByIdAndUpdate(getUserWallet?._id, {
					balance: getUserWallet?.balance! - amount,
					credit: 0,
					debit: amount,
				});

				const createHisorySender = await adminTransactionHistory.create({
					message: `you have sent ${amount} to ${getReciever?.yourName}`,
                    receiver:getReciever?.yourName,
					transactionReference: referenceGeneratedNumber,
                    date :getDate
				});

				getUser?.transactionHistory?.push(
					new mongoose.Types.ObjectId(createHisorySender?._id),
				);

				getUser?.save();

				// reciever wallet
				await staffWalletModel.findByIdAndUpdate(getRecieverWallet?._id, {
					balance: getRecieverWallet?.balance! + amount,
					credit: amount,
					debit: 0,
				});

				const createHisoryReciever = await staffTransactionHistory.create({
					message: `an amount of ${amount} has been sent to you by ${getUser?.companyName}`,
					transactionType: "credit",
                    receiver:getUser?.yourName,
					transactionReference: referenceGeneratedNumber,
				});
				getReciever?.transactionHistory?.push(
					new mongoose.Types.ObjectId(createHisoryReciever?._id),
				);
				getReciever?.save();
			}

			return res.status(200).json({
				message: "Transaction successfull",
			});
		} else {
			return res.status(404).json({
				message: "Account not found",
			});
		}
	} catch (err) {
		return res.status(404).json({
			message: "an error occurred",
			err,
		});
	}
};




//admin transfer from wallet to staff wallet for staffs with a plan

export const staffWithPlans = async(req:Request , res:Response)=>{
	try {
		const {walletNumber , amount}= req.body

		const getDate = new Date().toDateString()
		const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;


		//get details of the admin sending the money
		const getAdmin = await adminAuth.findById(req.params.userId);
		const getAdminWallet = await adminWalletModel.findById(req.params.walletID);

		///get the details of the staff you want to pay
		const getStaff = await staffAuth.findOne({ walletNumber });
		const getStaffWallet = await staffWalletModel.findById(getStaff?._id);

		//get staff with either plans

		const getPlan = await houseModel.findById(req.params.planId)


if(getPlan?.subscribe === true){
	if(getStaff && getAdmin){
		await adminWalletModel.findByIdAndUpdate(getAdminWallet?._id, {
			balance: getAdminWallet?.balance! - amount,
			credit: 0,
			debit: amount,
		});
		const createHisorySender = await adminTransactionHistory.create({
			message: `you have sent ${amount} to ${getStaff?.yourName}`,
			receiver:getStaff?.yourName,
			transactionReference: referenceGeneratedNumber,
			date :getDate
		});

		getAdmin?.transactionHistory?.push(
			new mongoose.Types.ObjectId(createHisorySender?._id),
		);
		getAdmin?.save();

		const total = amount - getPlan.percentageRate

		await staffWalletModel.findByIdAndUpdate(getStaffWallet?._id, {
			balance: getStaffWallet?.balance! + total ,
			credit: amount,
			debit: 0,
		});

		const createHisoryReciever = await staffTransactionHistory.create({
			message: `an amount of ${amount} has been sent to you by ${getAdmin?.companyName} but the sum of ${getPlan?.percentageRate} has been deducted`,
			transactionType: "credit",
			receiver:getStaff?.yourName,
			transactionReference: referenceGeneratedNumber,
		});
		getStaff?.transactionHistory?.push(
			new mongoose.Types.ObjectId(createHisoryReciever?._id),
		);
		getStaff?.save();
	}

	return res.status(200).json({
		message: "Transaction successfull",
	});
}else {
	return res.status(404).json({
		message: "Account not found",
	});
}



	} catch (error) {
		return res.status(404).json({
			message: "an error occurred",
			error,
		});
	}
}