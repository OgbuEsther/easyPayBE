"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOutToBank = exports.payOutFromWallet = exports.payInToWallet2 = exports.payInToWallet = exports.fundWalletFromBank = exports.staffWithPlans = exports.MakeTransfer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const staffAuth_1 = __importDefault(require("../../../model/staff/staffAuth"));
const adminAuth_1 = __importDefault(require("../../../model/admin/adminAuth"));
const adminWallets_1 = __importDefault(require("../../../model/admin/admindashboard/adminWallets"));
const adminTransactionHistorys_1 = __importDefault(require("../../../model/admin/admindashboard/adminTransactionHistorys"));
const stafftransactionHistorys_1 = __importDefault(require("../../../model/staff/staffDashboard/stafftransactionHistorys"));
const StaffWallet_1 = __importDefault(require("../../../model/staff/staffDashboard/StaffWallet"));
const StaffHouse_1 = __importDefault(require("../../../model/staff/staffDashboard/StaffHouse"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
//admin transfer from wallet to staff wallet for staffs with no plans
const MakeTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { walletNumber, amount } = req.body;
        const getDate = new Date().toDateString();
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        //RECIEVER ACCOUNT
        const getReciever = yield staffAuth_1.default.findOne({ walletNumber });
        const getRecieverWallet = yield StaffWallet_1.default.findById(getReciever === null || getReciever === void 0 ? void 0 : getReciever._id);
        // SENDER ACCOUNT
        const getUser = yield adminAuth_1.default.findById(req.params.UserId);
        const getUserWallet = yield adminWallets_1.default.findById(req.params.WalletID);
        if (getUser && getReciever) {
            if (amount > (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance)) {
                return res.status(404).json({
                    message: "insufficent fund.",
                });
            }
            else {
                // undating the sender walllet
                yield adminWallets_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
                    balance: (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getReciever === null || getReciever === void 0 ? void 0 : getReciever.yourName}`,
                    receiver: getReciever === null || getReciever === void 0 ? void 0 : getReciever.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                (_a = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getUser === null || getUser === void 0 ? void 0 : getUser.save();
                // reciever wallet
                yield StaffWallet_1.default.findByIdAndUpdate(getRecieverWallet === null || getRecieverWallet === void 0 ? void 0 : getRecieverWallet._id, {
                    balance: (getRecieverWallet === null || getRecieverWallet === void 0 ? void 0 : getRecieverWallet.balance) + amount,
                    credit: amount,
                    debit: 0,
                });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} has been sent to you by ${getUser === null || getUser === void 0 ? void 0 : getUser.companyName}`,
                    transactionType: "credit",
                    receiver: getUser === null || getUser === void 0 ? void 0 : getUser.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_b = getReciever === null || getReciever === void 0 ? void 0 : getReciever.transactionHistory) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getReciever === null || getReciever === void 0 ? void 0 : getReciever.save();
            }
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found",
            });
        }
    }
    catch (err) {
        return res.status(404).json({
            message: "an error occurred",
            err,
        });
    }
});
exports.MakeTransfer = MakeTransfer;
//admin transfer from wallet to staff wallet for staffs with a plan
const staffWithPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { walletNumber, amount } = req.body;
        const getDate = new Date().toDateString();
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        //get details of the admin sending the money
        const getAdmin = yield adminAuth_1.default.findById(req.params.userId);
        const getAdminWallet = yield adminWallets_1.default.findById(req.params.walletID);
        ///get the details of the staff you want to pay
        const getStaff = yield staffAuth_1.default.findOne({ walletNumber });
        const getStaffWallet = yield StaffWallet_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        //get staff with either plans
        const getPlan = yield StaffHouse_1.default.findById(req.params.planId);
        if ((getPlan === null || getPlan === void 0 ? void 0 : getPlan.subscribe) === true) {
            if (getStaff && getAdmin) {
                yield adminWallets_1.default.findByIdAndUpdate(getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet._id, {
                    balance: (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName}`,
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                (_c = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.transactionHistory) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
                const total = amount - getPlan.percentageRate;
                yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                    balance: (getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) + total,
                    credit: amount,
                    debit: 0,
                });
                yield StaffHouse_1.default.findByIdAndUpdate(getPlan === null || getPlan === void 0 ? void 0 : getPlan._id, {
                    percentageRate: getPlan === null || getPlan === void 0 ? void 0 : getPlan.percentageRate,
                    totalBal: total,
                    subscribe: true,
                });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} has been sent to you by ${getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyName} but the sum of ${getPlan === null || getPlan === void 0 ? void 0 : getPlan.percentageRate} has been deducted`,
                    transactionType: "credit",
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_d = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
            }
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred",
            error,
        });
    }
});
exports.staffWithPlans = staffWithPlans;
//fund your wallet from your bank
const fundWalletFromBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const getUser = yield adminAuth_1.default.findById(req.params.userId);
        const getWallet = yield adminWallets_1.default.findById(req.params.walletId);
        const { amount, transactinRef } = req.body;
        yield adminWallets_1.default.findByIdAndUpdate(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id, {
            balance: (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance) + amount,
        });
        const createHisorySender = yield adminTransactionHistorys_1.default.create({
            message: `an amount of ${amount} has been credited to your wallet`,
            transactionType: "credit",
            transactionReference: transactinRef,
        });
        (_e = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _e === void 0 ? void 0 : _e.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
        res.status(200).json({
            message: "Wallet updated successfully",
        });
    }
    catch (err) {
        return res.status(404).json({
            message: "an error occurred",
            err,
        });
    }
});
exports.fundWalletFromBank = fundWalletFromBank;
const secretKey = "sk_test_rSihim6nnGwbvXXN5jbFB7fWU91MGog8ap3vGPko";
const encrypt = "nmtoaxoUniDpZ4C3z1JGmkwLhAs1jLQV";
const urlData = "https://api.korapay.com/merchant/api/v1/charges/card";
// function encryptAES256(encryptionKey: string, paymentData: any) {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
//   const encrypted = cipher.update(paymentData);
//   const ivToHex = iv.toString("hex");
//   const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString(
//     "hex"
//   );
//   return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
// }
const payInToWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const getRegisterAdmin = yield adminAuth_1.default.findById(req.params.id);
        if (getRegisterAdmin) {
            const data = {
                amount: `${amount}`,
                redirect_url: "https://codelab-student.web.app",
                currency: "NGN",
                reference: `${(0, uuid_1.v4)()}`,
                narration: "Fix Test Webhook",
                channels: ["card"],
                default_channel: "card",
                customer: {
                    name: `${getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.companyName}`,
                    email: `${getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.companyEmail}`,
                },
                notification_url: "https://webhook.site/8d321d8d-397f-4bab-bf4d-7e9ae3afbd50",
                metadata: {
                    key0: "test0",
                    key1: "test1",
                    key2: "test2",
                    key3: "test3",
                    key4: "test4",
                },
            };
            var config = {
                mathod: "post",
                maxBodyLength: Infinity,
                url: "https://api.korapay.com/merchant/api/v1/charges/initialize",
                headers: {
                    // "Content-Type": "application/json",
                    Authorization: `Bearer ${secretKey}`,
                },
                data: data,
            };
            yield (0, axios_1.default)(config)
                .then(function (response) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const getWallet = yield adminWallets_1.default.findById(getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin._id);
                    yield adminWallets_1.default.findByIdAndUpdate(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id, {
                        balance: (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance) + amount,
                    }, { new: true });
                    const createHisorySender = yield adminTransactionHistorys_1.default.create({
                        message: `an amount of ${amount} has been credited to your wallet`,
                        transactionType: "credit",
                        // transactionReference: "12345",
                    });
                    (_a = getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.transactionHistory) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                    return res.status(200).json({
                        message: `an amount of ${amount} has been added`,
                        data: {
                            paymentInfo: amount,
                            paymentData: JSON.parse(JSON.stringify(response.data)),
                        },
                    });
                });
            })
                .catch(function (error) {
                console.log(error);
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred",
            err: error.message,
        });
    }
});
exports.payInToWallet = payInToWallet;
const payInToWallet2 = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.payInToWallet2 = payInToWallet2;
const payOutFromWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred while pay out from wallet",
            data: error.message,
        });
    }
});
exports.payOutFromWallet = payOutFromWallet;
const checkOutToBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, name, number, cvv, pin, expiry_year, expiry_month, title, description, } = req.body;
        const getStaffInfo = yield staffAuth_1.default.findById(req.params.id);
        var data = JSON.stringify({
            reference: (0, uuid_1.v4)(),
            destination: {
                type: "bank_account",
                amount: "9000",
                currency: "NGN",
                narration: "Test Transfer Payment",
                bank_account: {
                    bank: "033",
                    account: "0000000000",
                },
                customer: {
                    name: `${getStaffInfo === null || getStaffInfo === void 0 ? void 0 : getStaffInfo.yourName}`,
                    email: `${getStaffInfo === null || getStaffInfo === void 0 ? void 0 : getStaffInfo.email}`,
                },
            },
        });
        var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://api.korapay.com/merchant/api/v1/transactions/disburse",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secretKey}`,
            },
            data: data,
        };
        (0, axios_1.default)(config)
            .then(function (response) {
            return res.status(201).json({
                message: "success",
                data: JSON.parse(JSON.stringify(response.data)),
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkOutToBank = checkOutToBank;