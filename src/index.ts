import { Elysia } from 'elysia';

const target = process.env.FORWARD_URL;
if (!target) {
  console.error('FORWARD_URL is not set');
  process.exit(1);
}

const app = new Elysia()
  .post(
    '/',
    async ({ request }) => {
      const headers = new Headers(request.headers);
      headers.delete('host');
      headers.delete('content-length');
      const res = await fetch(target, { method: 'POST', headers, body: await request.arrayBuffer() });
      return new Response(null, { status: res.status });
    },
    { parse: 'none' },
  )
  .listen(Number(process.env.PORT ?? 8080));

console.log(`Listening on ${app.server!.url}`);
