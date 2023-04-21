import * as express from 'express';
import 'express-async-errors';
import * as cors from 'cors';
import { AppDataSource } from './database/data-source';

/* import routes */
import {
  AuthRouter,
  ClaimRouter,
  UserRouter,
  CommonRouter,
  RequestRouter,
  RequestHistoryRouter,
  CustomerRouter,
  ContractRouter,
  PlannerRouter,
  PlannerLoginHistoryRouter,
  PlannerReferralHistoryRouter,
} from './routes';

AppDataSource.initialize()
  .then(async () => {
    const PORT = process.env.PORT || 3000;

    // TODO: 나중에 추가
    // const corsOptions = {
    //   origin: "http://169.254.169.254:80/",
    //   optionsSuccessStatus: 200,
    // };

    /* start express */
    const app = express();

    /* setup express app */
    app.use(cors({ origin: true }));
    // app.use(express.json());
    // app.use(express.urlencoded({ extended: true }));
    //app.use(bodyParser.json()); => bodyparser 왜 사용 안하나?

    // TODO: 나중에 추가
    // app.all("/*", function (req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //   next();
    // });

    app.use('/api/v2/auth', AuthRouter);
    app.use('/api/v2/customer', CustomerRouter);
    app.use('/api/v2/claim', ClaimRouter);
    app.use('/api/v2/user', UserRouter);
    app.use('/api/v2/common', CommonRouter);
    app.use('/api/v2/contract', ContractRouter);
    app.use('/api/v2/planner', PlannerRouter);
    app.use('/api/v2/request', RequestRouter);

    // TODO: router 추가하기
    // RequestHistoryRouter;
    // PlannerLoginHistoryRouter;
    // PlannerReferralHistoryRouter;

    /* start express server */
    app.listen(PORT, () => {
      console.log(
        `Express server has started on port ${PORT}. Open http://localhost:${PORT}/users to see results`
      );
    });
  })
  .catch((error) => console.log(error));
