import { generateAccountNumber } from '../lib/generators/accountnumber.generator.js';
import Account from '../models/account.model.js';
import User from '../models/user.model.js';

import { 
  handleServerError,
  sendValidationError,
  sendUnauthorizedResponse,
  sendNotFoundResponse,
  sendForbiddenResponse,
  sendConflictingResponse, 
  successResponse
} from '../utils/response.utils.js';

export const createAccount = async (req, res) => {
  try {
    const { initialDeposit=0, bankName, accountType, ifsCode = 'IFSC0001' } = req.body;
    const userId = req.user.id || req.user._id || req.user.userId;
    console.log(userId);

    const accountTypes = ['savings', 'current', 'fixed'];


    if(!accountType || !accountTypes.includes(accountType)) {
      return sendValidationError(res, 'Invalid or Missing Account Type');
    }

    if(initialDeposit < 0) {
      return sendValidationError(res, 'Initial Deposit cannot be negative');
    }

    const accountNo = generateAccountNumber();

    const newAccount = new Account({
      userId: userId,
      accountNo,
      balance: initialDeposit,
      bankName,
      accountType,
      ifsCode
    });

    await newAccount.save();

    return successResponse(res, 200, 'Account Created Successfully', newAccount);
  }catch(error) {
    return handleServerError(res, 500, 'Error Creating Account', error.message);
  }
}

export const getAccountByUserID = async (req, res) => {
  try {
    const userId = req.user._id || req.params.userId;

    // if(userId !== req.user._id && req.user.role !== 'admin') {
    //   return sendForbiddenResponse(res, 'Access Denied');
    // }

    const accounts = await Account.find({ userId, isActive: true });
    // .populate('userId', 'name email phoneNo');

    if(!accounts) {
      return sendNotFoundResponse(res, 'No Account(s) Found');
    }

    return successResponse(res, 200, 'Accounts Retrieved Successfully', accounts);
  }catch(error) {
    return handleServerError(res, 500, 'Error Fetching Account Details', error.message);
  }
}

export const getAccountByAccountNo = async (req, res) => {
  try {
    const { accountNo } = req.params;

    if(!accountNo) {
      return sendValidationError(res, 'Account Number is mandatory');
    }

    const account = await Account.findOne({ accountNo, isActive: true });

    if(!account) {
      return sendNotFoundResponse(res, 'Account Not Found');
    }

    if(account.userId._id.toString() !== req.user._id.toString()) {
      return sendForbiddenResponse(res, 'Access Denied');
    }

    return successResponse(res, 200, 'Account Found', account);
  }catch(error) {
    return handleServerError(res, 500, 'Invalid Server Error', error.message);
  }
}

const getAllUserAccounts = (req, res)=>{
  return false;
}

export const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { accountType } = req.body;

    if(!accountType) {
      return sendValidationError(res, 'New Account Type is required');
    }

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
      isActive: true
    });

    if(!account) {
      return sendNotFoundResponse(res, 'Account not found');
    }

    if(accountType && ['savings', 'current', 'fixed'].includes(accountType)) {
      account.accountType = accountType;
    }

    await account.save();

    return successResponse(res, 200, 'Account Updated Successfully', account);
  }catch(error) {
    return handleServerError(res, 'Could not Update Account Details', error.message);
  }
}

export const deactivateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
      isActive: true
    });

    if(!account) {
      return sendNotFoundResponse(res, 'Account Not Found');
    }

    if(account.balance > 0) {
      return sendValidationError(res, 'Cannot deactivate account with remaining balance');
    }

    account.isActive = false;
    await account.save();

    return successResponse(res, 200, 'Account Deactivated Successfully');
  }catch(error) {
    return handleServerError(res, 'Invalid Server Error', error.message);
  }
}