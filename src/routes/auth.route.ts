import express from 'express';
import {
  signInCustomer,
  signInByAplus,
  inputCustomerData,
  sendAuthCode,
} from '../api/auth/auth.controller';

const router = express.Router();

/* URL : "/auth" */
// TODO: authcheck, validation middleware
router.post('/planner', signInByAplus);
router.post('/customer', signInCustomer);
router.post('/customer/add', inputCustomerData);
// router.post('/certification/customer/verify', sendAuthCode);
// router.post('/certification/planner', signInByAplus);

export default router;
