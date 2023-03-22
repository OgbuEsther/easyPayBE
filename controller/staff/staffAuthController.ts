import staffAuth from "../../model/staff/staffAuth";
import staffWalletModel from "../../model/staff/staffDashboard/StaffWallet";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const staffSignup = async (req: Request, res: Response) => {
  try {
    const { companyName, email, yourName, password, position } = req.body;

     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);

     const dater = Date.now();

     const generateNumber = Math.floor(Math.random() * 78) + dater;


    const staff = await staffAuth.create({
      companyName,
      email,
      yourName,
      password: hash,
      position,
    });

     const createWallet = await staffWalletModel.create({
       _id: staff?._id,
       balance: 15000,
       walletNumber: generateNumber,
       credit: 0,
       debit: 0,
     });

     staff?.wallet.push(new mongoose.Types.ObjectId(createWallet?._id));

     staff.save();
    return res.status(200).json({
      message: "Success",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occurred while creating staff",
      data: error.message,
    });
  }
};

export const staffSignin = async (req: Request, res: Response) => {
  try {
    const { companyName, email, password } = req.body;

    const staff = await staffAuth.findOne({ email });

    return res.status(200).json({
      message: "Success , staff is logged in",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occurred while logging in staff",
      data: error.message,
    });
  }
};

//get all admins
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.find();

    return res.status(200).json({
      message: "get all staff",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get staff",
      data: error,
      err: error.message,
    });
  }
};

export const getOneStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.findById(req.params.staffId);

    return res.status(200).json({
      message: "gotten one staff",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get staff",
      data: error,
      err: error.message,
    });
  }
};
