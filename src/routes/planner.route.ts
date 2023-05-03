import express from 'express';
const router = express.Router();

/* import controller */
import {
  plannerOwn,
  plannerById,
  plannersByName,
  plannerByInvitation,
  loginHistory,
  referralHistory,
  createPlannerReferralHistory,
  updateCompanyPlanners,
} from '../api/planner/planner.controller';

/* import middleware */
import AppAuthChecker from '../middlewares/AppAuthChecker';
import AuthorizedOwnPlanner from '../middlewares/AuthorizedOwnPlanner';
import validateBody from '../middlewares/validation';

/* import type */
import { CreatePlannerReferralHistoryInput } from '../api/planner/planner.types';

// ========================= ROUTE MIDDLEWARE =========================
router.use(AppAuthChecker);

// =============================== ROUTE ==============================
router.get('/', plannerOwn);
router.get('/id/:plannerId', AuthorizedOwnPlanner, plannerById);
router.get('/name/:name', plannersByName);
router.get('/invited/:plannerId', plannerByInvitation);
router.get('/history', loginHistory);
router.get('/history/refer', referralHistory);
router.post(
  '/history/refer/list',
  validateBody(CreatePlannerReferralHistoryInput),
  createPlannerReferralHistory
);
router.post('/list/update', updateCompanyPlanners);

export default router;
