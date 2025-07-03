import Router from 'express';

import { authenticateToken } from '../middleware/auth.middleware.js';

import { createAccount, deactivateAccount, getAccountByAccountNo, getAccountByUserID, updateAccount,  } from '../controllers/account.controller.js';


const router = Router();

router.use(authenticateToken);

router.post('/', createAccount);

router.get('/user/:userId', getAccountByUserID);
router.get('/account-number/:accountNo', getAccountByAccountNo);

router.put('/:accountId', updateAccount);
router.delete('/:accountId', deactivateAccount); 

export default router;
