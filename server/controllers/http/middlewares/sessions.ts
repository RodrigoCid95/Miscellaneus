export const verifyPointSaleSession = (req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response, next: Next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    next()
    return
  }
  res.redirect('/admin')
}

export const verifyAdminSession = (req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response, next: Next) => {
  if (!req.session.user || req.session.user.isAdmin) {
    next()
    return
  }
  res.redirect('/')
}