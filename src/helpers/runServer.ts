import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import * as proxy from 'koa-better-http-proxy'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { cwd } from 'process'
import { resolve } from 'path'
import env from '@/helpers/env'

export default async function () {
  const app = new Koa()

  const router = new Router()
  await bootstrapControllers({
    app,
    router,
    basePath: '/',
    controllers: [resolve(cwd(), 'dist/controllers/*')],
    disableVersioning: true,
  })
  app.use(
    proxy('https://api.farcaster.xyz', {
      proxyReqPathResolver: (ctx) => {
        return ctx.url.replace('/farcaster', '')
      },
      filter: (ctx) => {
        return /^\/farcaster/.test(ctx.url)
      },
      proxyReqOptDecorator: function (proxyReqOpts) {
        proxyReqOpts.headers = {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        }
        return proxyReqOpts
      },
      port: 443,
      preserveReqSession: false,
    })
  )
  app.use(cors({ origin: '*', credentials: true }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${env.PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
}
