import path from 'node:path'

const baseDir = process.env.BASE_DIR ? process.env.BASE_DIR : path.resolve(__dirname, '..', '..')

const db = {
  path: path.join(baseDir, 'data.db'),
}

export { db }