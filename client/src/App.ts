if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration)
      })
      .catch(error => {
        console.log('Fallo en el registro del Service Worker:', error)
      })
  })
}