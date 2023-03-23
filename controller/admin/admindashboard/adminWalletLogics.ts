import mongoose from "mongoose";
import staffAuth from "../../../model/staff/staffAuth";
import adminAuth from "../../../model/admin/adminAuth";
import express, { Request, Response } from "express";
import adminWalletModel from "../../../model/admin/admindashboard/adminWallets";
import adminTransactionHistory from "../../../model/admin/admindashboard/adminTransactionHistorys";
import staffTransactionHistory from "../../../model/staff/staffDashboard/stafftransactionHistorys";
import staffWalletModel from "../../../model/staff/staffDashboard/StaffWallet";
import houseModel from "../../../model/staff/staffDashboard/StaffHouse";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import axios from "axios";

//admin transfer from wallet to staff wallet for staffs with no plans

export const MakeTransfer = async (req: Request, res: Response) => {
  try {
    const { walletNumber, amount } = req.body;
    const getDate = new Date().toDateString();

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
          receiver: getReciever?.yourName,
          transactionReference: referenceGeneratedNumber,
          date: getDate,
        });

        getUser?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisorySender?._id)
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
          receiver: getUser?.yourName,
          transactionReference: referenceGeneratedNumber,
        });
        getReciever?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisoryReciever?._id)
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

export const staffWithPlans = async (req: Request, res: Response) => {
  try {
    const { walletNumber, amount } = req.body;

    const getDate = new Date().toDateString();
    const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;

    //get details of the admin sending the money
    const getAdmin = await adminAuth.findById(req.params.userId);
    const getAdminWallet = await adminWalletModel.findById(req.params.walletID);

    ///get the details of the staff you want to pay
    const getStaff = await staffAuth.findOne({ walletNumber });
    const getStaffWallet = await staffWalletModel.findById(getStaff?._id);

    //get staff with either plans

    const getPlan = await houseModel.findById(req.params.planId);

    if (getPlan?.subscribe === true) {
      if (getStaff && getAdmin) {
        await adminWalletModel.findByIdAndUpdate(getAdminWallet?._id, {
          balance: getAdminWallet?.balance! - amount,
          credit: 0,
          debit: amount,
        });
        const createHisorySender = await adminTransactionHistory.create({
          message: `you have sent ${amount} to ${getStaff?.yourName}`,
          receiver: getStaff?.yourName,
          transactionReference: referenceGeneratedNumber,
          date: getDate,
        });

        getAdmin?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisorySender?._id)
        );
        getAdmin?.save();

        const total = amount - getPlan.percentageRate;

        await staffWalletModel.findByIdAndUpdate(getStaffWallet?._id, {
          balance: getStaffWallet?.balance! + total,
          credit: amount,
          debit: 0,
        });

        await houseModel.findByIdAndUpdate(getPlan?._id, {
          percentageRate: getPlan?.percentageRate,
          totalBal: total,
          subscribe: true,
        });

        const createHisoryReciever = await staffTransactionHistory.create({
          message: `an amount of ${amount} has been sent to you by ${getAdmin?.companyName} but the sum of ${getPlan?.percentageRate} has been deducted`,
          transactionType: "credit",
          receiver: getStaff?.yourName,
          transactionReference: referenceGeneratedNumber,
        });
        getStaff?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisoryReciever?._id)
        );
        getStaff?.save();
      }

      return res.status(200).json({
        message: "Transaction successfull",
      });
    } else {
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
};

//fund your wallet from your bank

export const fundWalletFromBank = async (req: Request, res: Response) => {
  try {
    const getUser = await adminAuth.findById(req.params.userId);
    const getWallet = await adminWalletModel.findById(req.params.walletId);

    const { amount, transactinRef } = req.body;
    await adminWalletModel.findByIdAndUpdate(getWallet?._id, {
      balance: getWallet?.balance + amount,
    });

    const createHisorySender = await adminTransactionHistory.create({
      message: `an amount of ${amount} has been credited to your wallet`,
      transactionType: "credit",
      transactionReference: transactinRef,
    });

    getUser?.transactionHistory?.push(
      new mongoose.Types.ObjectId(createHisorySender?._id)
    );

    res.status(200).json({
      message: "Wallet updated successfully",
    });
  } catch (err) {
    return res.status(404).json({
      message: "an error occurred",
      err,
    });
  }
};

const secretKey = "sk_test_bmXZFEi6VAdLDSB7r47MbWRBBEMZ1C7oTKRTz6M5";
const encrypt = "nmtoaxoUniDpZ4C3z1JGmkwLhAs1jLQV";
const urlData = "https://api.korapay.com/merchant/api/v1/charges/card";

function encryptAES256(encryptionKey: string, paymentData: any) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
  const encrypted = cipher.update(paymentData);

  const ivToHex = iv.toString("hex");
  const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString(
    "hex"
  );

  return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
}

export const testing = async (
  req: Request,
  res: Response
)=> {
  try {
    const { amount } = req.body;

    const getRegisterAdmin = await adminAuth.findById(req.params.id);

    if (getRegisterAdmin) {
      const data = {
        amount: `${amount}`,
        redirect_url: "https://codelab-student.web.app",
        currency: "NGN",
        reference: `${uuid()}`,
        narration: "Fix Test Webhook",
        channels: ["card"],
        default_channel: "card",
        customer: {
          name: `${getRegisterAdmin?.companyName}`,
          email: `${getRegisterAdmin?.companyEmail}@gmail.com`,
        },
        notification_url:
          "https://webhook.site/8d321d8d-397f-4bab-bf4d-7e9ae3afbd50",
        metadata: {
          key0: "test0",
          key1: "test1",
          key2: "test2",
          key3: "test3",
          key4: "test4",
        },
      };

      let config = {
        mathod: "POST",
        maxBodyLength: Infinity,
        url: "https://api.korapay.com/merchant/api/v1/charges/initialize",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        data: data,
      };
      await axios(config).then(async function (response) {
        const getWallet = await adminWalletModel.findById(req.params.id);

        await adminWalletModel.findByIdAndUpdate(getWallet?._id, {
          balance: getWallet?.balance + amount,
        });
        const createHisorySender = await adminTransactionHistory.create({
          message: `an amount of ${amount} has been credited to your wallet`,
          transactionType: "credit",
          transactionReference: uuid(),
        });
        getRegisterAdmin?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisorySender?._id)
        );
        res.status(200).json({
          message: "Wallet updated successfully",
        });
      });
    } else {
      return res.status(404).json({
        message: "Account not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "an error occurred",
      err: error.message,
    });
  }
};
