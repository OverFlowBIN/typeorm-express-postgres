import '../configure';
import AWS from 'aws-sdk';

const kms = new AWS.KMS();

export const encrypt = async (key: string, data: string) => {
  const result = await kms
    .encrypt({
      KeyId: key,
      Plaintext: data,
    })
    .promise();
  // TODO: Error handler / 자체적으로 가능?? / 로직적으로 필요여부 파악하기

  return result.CiphertextBlob.toString('base64');
};

export const decrypt = async (data: string) => {
  const result = await kms
    .decrypt({
      CiphertextBlob: Buffer.from(data, 'base64'),
    })
    .promise();
  // TODO: Error handler ??

  return result.Plaintext.toString();
};

if (require.main === module) {
  const keyId = process.argv[2];
  const text = process.argv[3];

  encrypt(keyId, text).then((data) => console.log(data));
}
