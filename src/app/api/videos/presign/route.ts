// Server — Generate pre-signed PUT URL for video upload to S3
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;         // 5 MB

export async function POST(req: NextRequest) {
  try {
    const { moduleId, fileName, contentType, kind = 'video' } = await req.json();

    if (!moduleId || !fileName || !contentType) {
      return NextResponse.json({ error: 'moduleId, fileName, contentType required' }, { status: 400 });
    }

    const allowed = kind === 'thumbnail' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
    const maxSize = kind === 'thumbnail' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

    if (!allowed.includes(contentType)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const ext  = fileName.split('.').pop() ?? 'bin';
    const key  = `module-videos/${moduleId}/${kind === 'thumbnail' ? 'thumbs' : 'files'}/${randomUUID()}.${ext}`;

    const url = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         key,
        ContentType: contentType,
        ContentDisposition: 'inline',
        Metadata: { moduleId, kind },
      }),
      { expiresIn: 900 } // 15 min to complete upload
    );

    return NextResponse.json({ uploadUrl: url, key, maxBytes: maxSize });
  } catch (err: any) {
    console.error('[presign]', err);
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}
