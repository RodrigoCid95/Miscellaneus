const user = JSON.parse(localStorage.getItem('user') || 'null')
if (user) {
  if (user.isAdmin) {
    import('./server/public/js/admin.js')
  } else {
    import('./server/public/js/checkout.js')
  }
} else {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = './server/public/css/login.css'
  document.head.appendChild(link)
  import('./server/public/js/login.js')
}