export const verifySession = (req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response, next: Next) => {
  if (!req.session.user) {
    res.json({
      ok: false,
      code: 'missing-session',
      message: 'La sesión es requerida.'
    })
    return
  }
  next()
}

export const verifyAdminSession = (req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response, next: Next) => {
  if (!req.session.user) {
    res.json({
      ok: false,
      code: 'missing-session',
      message: 'La sesión es requerida.'
    })
    return
  }
  if (!req.session.user.isAdmin) {
    res.json({
      ok: false,
      code: 'permission-denied',
      message: 'No tienes permiso para hacer esto.'
    })
    return
  }
  next()
}