import { Application, Router } from 'https://deno.land/x/oak@v12.3.0/mod.ts';
import { Command } from 'npm:commander';

const command = new Command('web-diag')
  .option('--content-type <mime-type>', 'Makes the web server send a specific content type header back. Note that this may be different from the actual type in the message body! Good for simulating a bad web server that presents PDFs/binary files as text/html.');

const redirectCommand = command.command('redirect')
  .option('--hops <count>', 'How many redirections to put the requester through.');

const app = new Application();

const router = new Router();

command.action(async (...args) => {
  router.get('/test', (ctx) => {
    if (ctx.request.method !== 'HEAD')
      ctx.response.body = 'KANSAS!';
  });
  
  app.use(router.routes());
  app.use(router.allowedMethods());
  
  console.log('Server is running.');
  await app.listen({
    port: 8001,
  });
});

command.parseAsync(['deno', 'web-diag', ...Deno.args]);