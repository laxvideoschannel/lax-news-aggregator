export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// File-based persistence (works on Vercel if you use /tmp, but for a simple admin review
// storing in memory per serverless instance is fine since admin reviews on same session)
// For production, connect to Supabase / a DB. For now: /tmp/school-submissions.json
const DB_PATH = '/tmp/laxhub-school-submissions.json';

function readAll(): any[] {
  try {
    if (!existsSync(DB_PATH)) return [];
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  } catch { return []; }
}

function writeAll(data: any[]) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  return Response.json(readAll());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const all = readAll();
    const entry = {
      ...body,
      id: `sub_${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    all.push(entry);
    writeAll(all);
    return Response.json({ ok: true, id: entry.id });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const all = readAll();
    const idx = all.findIndex((s: any) => s.id === id);
    if (idx === -1) return Response.json({ ok: false }, { status: 404 });
    all[idx].status = status;
    writeAll(all);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const all = readAll().filter((s: any) => s.id !== id);
    writeAll(all);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
