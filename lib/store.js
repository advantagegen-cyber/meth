import { put, list } from '@vercel/blob';

const KEY = 'data/methods.json';

export async function readAll() {
  const { blobs } = await list({ prefix: KEY });
  const b = blobs.find((x) => x.pathname === KEY);
  if (!b) return [];
  const r = await fetch(b.url + '?t=' + Date.now(), { cache: 'no-store' });
  return r.ok ? await r.json() : [];
}

export async function writeAll(items) {
  await put(KEY, JSON.stringify(items), {
    access: 'public', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60,
  });
}
