import crypto from 'crypto';
import { cookies } from 'next/headers';

const code = () => process.env.ADMIN_CODE || '';
export const token = () => crypto.createHmac('sha256', code()).update('meth-hub-admin').digest('hex');

function same(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
export const codeOk = (c) => code().length > 0 && same(c, code());
export function isAdmin() {
  const v = cookies().get('mh_admin')?.value;
  return !!v && code().length > 0 && same(v, token());
}
