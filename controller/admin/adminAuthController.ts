import adminAuth from "../../model/admin/adminAuth";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import adminWalletModel from "../../model/admin/admindashboard/adminWallets";

export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { companyName, companyEmail, yourName, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const dater = Date.now();

    const generateNumber = Math.floor(Math.random() * 78) + dater;

    const admin = await adminAuth.create({
      companyName,
      companyEmail,
      yourName,
      password: hash,
    });

    const createWallet = await adminWalletModel.create({
      _id: admin?._id,
      balance: 15000,
      walletNumber: generateNumber,
      credit: 0,
      debit: 0,
    });

    admin?.wallet.push(new mongoose.Types.ObjectId(createWallet?._id));

    admin.save();

    return res.status(200).json({
      message: "Success",
      data: admin,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occurred while creating admin",
      data: error.message,
    });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  try {
    const { companyEmail, password } = req.body;

    const admin = await adminAuth.findOne({ companyEmail });

    return res.status(200).json({
      message: "Success , admin is logged in",
      data: admin,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occurred while creating admin",
      data: error.message,
    });
  }
};

//get all admins
export const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminAuth.find();

    return res.status(200).json({
      message: "get all admins",
      data: admin,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get admin",
      data: error,
      err: error.message,
    });
  }
};

export const getOneAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminAuth.findById(req.params.adminId);

    return res.status(200).json({
      message: "get one admin",
      data: admin,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get one admin",
      data: error,
      err: error.message,
    });
  }
};
