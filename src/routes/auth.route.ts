import express from 'express';
import {
  signInCustomer,
  signInByAplus,
  inputCustomerData,
  sendAuthCode,
  refreshAccessToken,
} from '../api/auth/auth.controller';

const router = express.Router();

/* URL : "/auth" */
// TODO: authcheck, validation middleware
router.post('/planner', signInByAplus);
router.post('/customer', signInCustomer);

// TODO: customer 부분으로 옮겨야 할듯?
router.post('/customer/add', inputCustomerData);
// router.post('/certification/customer/verify', sendAuthCode);
// router.post('/certification/planner', signInByAplus);

// TODO: input validation
router.post('/update/token', refreshAccessToken);

export default router;
