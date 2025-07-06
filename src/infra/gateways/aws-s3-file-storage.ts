import { Injectable } from "@nestjs/common";
import { config, S3 } from "aws-sdk";

@Injectable()
export class AwsS3FileStorage {
  constructor() {
    const accessKey: string = process.env.ACCESS_KEY as string;
    const secret: string = process.env.SECRET_KEY as string;
    
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    });
  }

  async upload({ fileName, file }: { file: Buffer, fileName: string }): Promise<void> {
    const bucket = process.env.BATCH_TRANSACTION_BUCKET_NAME as string;
    const s3 = new S3();
    await s3.putObject({
      Bucket: bucket,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }).promise();
  }
}