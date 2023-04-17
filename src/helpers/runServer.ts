import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
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
    basePath: '/',
    controllers: [resolve(cwd(), 'dist/controllers/*')],
    disableVersioning: true,
    router,
  })
  app.use(cors({ credentials: true, origin: '*' }))
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
