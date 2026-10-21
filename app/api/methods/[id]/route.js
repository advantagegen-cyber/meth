import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { isAdmin } from '../../../../lib/auth';
import { readAll, writeAll } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: 'Not allowed.' }, { status: 401 });
  const items = await readAll();
  const hit = items.find((m) => m.id === params.id);
  if (!hit) return NextResponse.json({ error: 'Method not found.' }, { status: 404 });
  await writeAll(items.filter((m) => m.id !== params.id));
  if (hit.img) { try { await del(hit.img); } catch {} }
  return NextResponse.json({ ok: true });
}
