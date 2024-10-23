import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import session from 'express-session'
import compression from 'compression'
import { Liquid } from 'liquidjs'

let publicDir = path.join(process.cwd(), 'public')
let views = path.join(process.cwd(), 'views')
let keyPath = path.join(path.dirname(process.argv[1]), 'key.pem')

IS_RELEASE && ((() => {
  const { entrypoint } = (process as any).pkg
  const distDir = path.dirname(entrypoint)
  views = path.join(distDir, 'views')
  publicDir = path.join(distDir, 'public')
  keyPath = path.join(process.cwd(), 'key.pem')
})())

if (!fs.existsSync(keyPath)) {
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  })
  fs.writeFileSync(keyPath, privateKey, 'utf-8')
}
const middlewares = [
  compression(),
  session({
    secret: fs.readFileSync(keyPath, 'utf-8'),
    resave: false,
    saveUninitialized: true
  })
]

export const HTTP: PXIOHTTP.Config = {
  middlewares,
  optionsUrlencoded: { extended: true },
  engineTemplates: {
    name: 'liquid',
    ext: 'liquid',
    callback: (new Liquid({
      layouts: views,
      extname: 'liquid'
    })).express(),
    dirViews: views
  },
  pathsPublic: [
    { route: '/', dir: publicDir },
  ]
}