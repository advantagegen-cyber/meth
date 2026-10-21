import { NextResponse } from 'next/server';
import { codeOk, token, isAdmin } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ admin: isAdmin() });
}

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}
  if (!codeOk(body.code)) {
    await new Promise((r) => setTimeout(r, 700)); // slows down guessing
    return NextResponse.json({ error: 'Wrong code.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('mh_admin', token(), {
    httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: 60 * 60 * 8,
  });
  return res;
}
