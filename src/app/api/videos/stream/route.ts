// Server — Generate short-lived pre-signed GET URL for video/thumbnail streaming
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  // Only allow keys inside our video prefix
  if (!key.startsWith('module-videos/')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket:             BUCKET,
        Key:                key,
        ResponseContentDisposition: 'inline', // prevent browser download prompt
      }),
      { expiresIn: 300 } // 5 minutes — short window discourages URL sharing
    );

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('[stream]', err);
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}
