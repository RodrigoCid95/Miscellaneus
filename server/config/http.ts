import path from 'node:path'

const publicDir = path.join(process.cwd(), 'public')

export const HTTP: PXIOHTTP.Config = {
  pathsPublic: [
    { route: '/', dir: path.join(publicDir, 'point-of-sale') },
    { route: '/admin', dir: path.join(publicDir, 'admin') },
    { route: '/scanner', dir: path.join(publicDir, 'scanner') },
  ]
}