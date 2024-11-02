import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import session from 'express-session'
import compression from 'compression'
import { Liquid } from 'liquidjs'
import { createServer } from 'node:https'

const publicDir = process.env.BASE_DIR ? path.resolve(__dirname, '..', 'public') : path.resolve(__dirname, '..', '..', 'public')
const views = process.env.BASE_DIR ? path.resolve(__dirname, '..', 'views') : path.resolve(__dirname, '..', '..', 'views')
const certificate = process.env.BASE_DIR ? path.resolve(__dirname, '..', 'certificate') : path.resolve(__dirname, '..', '..', 'certificate')
const keyPath = process.env.BASE_DIR ? path.join(process.env.BASE_DIR, 'key.pem') : path.resolve(__dirname, '..', '..', 'key.pem')

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
  ],
  createServer: (app) => createServer({
    key: fs.readFileSync(path.join(certificate, 'key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(certificate, 'cert.pem'), 'utf-8')
  }, app)
}