import express, { NextFunction, Request, Response } from 'express';
// import {
//   getOrganization,
//   acceptRequestByManager,
//   recommendInsurance,
// } from '../controllers/common.controller';

const router = express.Router();

/* TEST MIDDLEWARE */
const a = (req: Request, res: Response, next: NextFunction) => {
  console.log('middleware 1');
  next();
};

const b = (req: Request, res: Response, next: NextFunction) => {
  console.log('middleware 2');
  if (req.method === 'GET') throw new Error('not status 200');
  next();
};

const c = (req: Request, res: Response, next: NextFunction) => {
  console.log('middleware 3');
  next();
};

router.get('/', [a, b, c], (req: Request, res: Response) => {
  res.send('middlewar end');
});
// router.post('/accept_req', acceptRequestByManager);
// router.get('/org_list', getOrganization);
// router.post('/recommand_insurance', recommendInsurance);

export default router;
