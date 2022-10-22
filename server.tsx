import browserSync, { Options } from 'browser-sync';
import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import path from 'path';
import StreamInjecter from 'stream-injecter';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App';

const ABORT_DELAY = 10000;

const app = new Koa();
app.use(serve(path.join(__dirname, '/public')));

if (process.env.NODE_ENV === 'development') {
  app.use(serve(path.join(__dirname, '/.parcel')));
}

const router = new Router();

async function render(ctx: Koa.Context) {
  let didError = false;

  /**
   * NOTE: use promise to force koa waiting for streaming.
   */
  return new Promise((_resolve, reject) => {
    const stream = ReactDOMServer.renderToPipeableStream(
      <StaticRouter location={ctx.url}>
        <App />
      </StaticRouter>,
      {
        bootstrapScripts: ['/index.js'],
        onShellReady() {
          ctx.respond = false;
          ctx.res.statusCode = didError ? 500 : 200;
          ctx.response.set('content-type', 'text/html');
          stream.pipe(ctx.res);
          ctx.res.end();
        },
        onError() {
          didError = true;
          reject();
        },
      },
    );
    setTimeout(() => {
      stream.abort();
      reject();
    }, ABORT_DELAY);
  });
}

router.get('(.*)', async (ctx) => {
  await render(ctx);
});

app.use(router.routes());
const bsc = browserSync.create();
let bs: browserSync.BrowserSyncInstance;
const opts: Options = {};
app.use(function (ctx, next) {
  return next()
    .then(function () {
      if (process.env.BROWSERSYNC_SNIPPET) return process.env.BROWSERSYNC_SNIPPET;
      if (!bs) {
        return new Promise(function (resolve, reject) {
          return bsc.init(opts, function (err, instance) {
            if (err) {
              return reject(err);
            }
            bs = instance;
            return resolve(bs.getOption('snippet'));
          });
        });
      }
      return bs.getOption('snippet');
    })
    .then((snippet: string) => {
      if (!snippet) return;

      if (!(ctx.response.type && ~ctx.response.type.indexOf('text/html'))) return;

      // Buffer
      if (Buffer.isBuffer(ctx.body)) {
        ctx.body = ctx.body.toString();
      }

      // String
      if (typeof ctx.body === 'string') {
        if (ctx.body.match(/client\/browser-sync-client/)) return;
        ctx.body = ctx.body.replace(/<\/body>/, snippet + '</body>');
      }

      // Stream
      if (ctx.body && typeof ctx.body.pipe === 'function') {
        var injecter = new StreamInjecter({
          matchRegExp: /(<\/body>)/,
          inject: snippet,
          replace: snippet + '$1',
          ignore: /client\/browser-sync-client/,
        });
        if (ctx.response.header['content-length']) {
          var size = +ctx.response.header['content-length'];
          if (size) ctx.set('Content-Length', String(size + Buffer.byteLength(snippet)));
        }
        ctx.body = ctx.body.pipe(injecter);
      }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Koa server is running at http://localhost:${port}`);
});
