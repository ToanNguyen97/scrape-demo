
import { errorResponse, successResponse } from '../responseHandler'
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextRequest } from 'next/server';

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const name = decodeURIComponent(searchParams.get('name') || '') || 'resume.pdf'
    const presignedURL = await getSignedUrl(
      S3,
      new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key: name }),
      { expiresIn: 3600 },
    )
    return successResponse({url: presignedURL})
  } catch (error) {
    return errorResponse(JSON.stringify(error))
  }
}