import Router from 'express';

import { addUPI, getUPI } from '../controllers/upi.controller.js';

const router = Router();

router.post('/upi/add', addUPI);
router.get('/upi/:userId', getUPI);

export default router;
