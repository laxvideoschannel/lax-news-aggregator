export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getVideoLibrary } from '@/lib/videos';

export async function GET() {
  const videos = await getVideoLibrary();
  return Response.json(videos);
}
