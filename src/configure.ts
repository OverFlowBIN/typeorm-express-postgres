import Aws from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const prodcutionSetup = () => {
  Aws.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
};

// const developmentSetup = () => {
//   Aws.config.update({
//     region: 'ap-northeast-2',
//     credentials: new Aws.SharedIniFileCredentials({
//       profile: 'newbople'
//     })
//   });
// };

prodcutionSetup();
// const environment = process.env.NODE_ENV;
// const isProduction = environment === 'production';
// if (isProduction) {
//   prodcutionSetup();
// } else {
//   developmentSetup();
// }
