import express from 'express';
import { UserService } from '../api/user/user.service';
import { testMiddle } from '../middlewares/test';

const router = express.Router();

router.get('/', testMiddle, new UserService().allUsers);

export default router;
