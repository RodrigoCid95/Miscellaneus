import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import https from 'node:https'
import session from 'express-session'
import compression from 'compression'
import { Liquid } from 'liquidjs'

const publicDir = process.env.BASE_DIR ? path.resolve(__dirname, '..', 'public') : path.resolve(__dirname, '..', '..', 'public')
const views = process.env.BASE_DIR ? path.resolve(__dirname, '..', 'views') : path.resolve(__dirname, '..', '..', 'views')
const certificate = process.env.BASE_DIR ? path.join(process.env.BASE_DIR, 'certificate') : path.resolve(__dirname, '..', '..', 'certificate')
let createServer: HTTP['createServer'] = undefined

if (process.env.BASE_DIR) {
  createServer = (app) => https.createServer({
    key: fs.readFileSync(path.join(certificate, 'key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(certificate, 'cert.pem'), 'utf-8')
  }, app)
}

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

const middlewares = [
  compression(),
  session({
    secret: privateKey,
    resave: false,
    saveUninitialized: true
  })
]

export const HTTP: HTTP = {
  certificate,
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
  createServer
}

interface HTTP extends PXIOHTTP.Config {
  certificate: string
}