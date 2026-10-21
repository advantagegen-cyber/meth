import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import { isAdmin } from '../../../lib/auth';
import { readAll, writeAll } from '../../../lib/store';

export const dynamic = 'force-dynamic';
const DIFFS = ['super easy', 'easy', 'medium', 'hard', 'super hard'];
const TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

export async function GET() {
  try {
    const items = (await readAll()).sort((a, b) => a.ts - b.ts);
    return NextResponse.json({ methods: items });
  } catch (e) {
    return NextResponse.json({ methods: [], error: 'Storage not configured' });
  }
}

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Not allowed.' }, { status: 401 });
  const f = await req.formData();
  const title = String(f.get('title') || '').trim().slice(0, 80);
  const desc = String(f.get('desc') || '').trim().slice(0, 140);
  const full = String(f.get('full') || '').trim().slice(0, 5000);
  const diff = String(f.get('diff') || '');
  if (!title || !desc || !DIFFS.includes(diff))
    return NextResponse.json({ error: 'Title, short description and difficulty are required.' }, { status: 400 });

  const id = crypto.randomUUID();
  let img = '';
  const file = f.get('image');
  if (file && typeof file === 'object' && file.size) {
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: 'Image must be PNG, JPG, WEBP or GIF.' }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'Image must be under 4 MB.' }, { status: 400 });
    img = (await put(`images/${id}.${ext}`, file, { access: 'public', addRandomSuffix: false })).url;
  }
  const items = await readAll();
  items.push({ id, title, diff, desc, full, img, ts: Date.now() });
  await writeAll(items);
  return NextResponse.json({ ok: true });
}
