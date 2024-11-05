const { app, BrowserWindow, ipcMain, Menu, clipboard, dialog } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')
const { createCA, createCert } = require('mkcert')

process.env.IS_DEV = process.env.IS_DEV !== undefined
process.env.BASE_DIR = process.env.IS_DEV !== 'false' ? process.cwd() : path.join(app.getPath('userData'), 'server')
if (!fs.existsSync(process.env.BASE_DIR)) {
  fs.mkdirSync(process.env.BASE_DIR, { recursive: true })
}

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces()
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal && interfaceInfo.address.split('.')[0] === '192') {
        return interfaceInfo.address
      }
    }
  }
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal && interfaceInfo.address.split('.')[0] === '172') {
        return interfaceInfo.address
      }
    }
  }
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal && interfaceInfo.address.split('.')[0] === '10') {
        return interfaceInfo.address
      }
    }
  }
  return 'localhost'
}

const certificatePath = path.join(process.env.BASE_DIR, 'certificate')
if (!fs.existsSync(certificatePath)) {
  fs.mkdirSync(certificatePath, { recursive: true })
}
createCA({
  organization: "Miscellaneous",
  countryCode: "MX",
  state: "Puebla",
  locality: "Chapulco",
  validity: 365
}).then(ca => {
  const localIP = getLocalIPAddress()
  const domains = ["127.0.0.1", "localhost"]
  if (!domains.includes(localIP)) {
    domains.unshift(localIP)
  }
  createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains,
    validity: 365
  }).then(cert => {
    fs.writeFileSync(path.join(certificatePath, 'key.pem'), cert.key)
    fs.writeFileSync(path.join(certificatePath, 'cert.pem'), cert.cert)
    fs.writeFileSync(path.join(certificatePath, 'rootCA.crt'), ca.cert)
  })
})

const { initWorkerServer, initHttpServer } = require('./dist/server/main')
const workerServer = initWorkerServer()

ipcMain.handle('worker', (_, ...args) => workerServer(...args))

let ipAddress = null
let mainWindow
let server = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'dist', 'server', 'public', 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if (process.env.IS_DEV !== 'false') {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

function exportCertificate() {
  const exportPath = dialog.showSaveDialogSync(mainWindow, {
    title: 'Exportar certificado',
    defaultPath: app.getPath('desktop'),
    buttonLabel: 'Exportar',
    filters: [
      { name: 'Certificado', extensions: ['crt'] }
    ]
  })
  if (exportPath) {
    fs.copyFileSync(path.join(certificatePath, 'rootCA.crt'), exportPath)
  }
}

function createMenu() {
  const menuTemplate = [
    {
      label: 'Servidor',
      submenu: [
        {
          label: 'Iniciar servidor',
          click: menuItem => startServer(menuItem)
        }
      ]
    },
    {
      label: 'Exportar certificado',
      click: exportCertificate
    }
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function startServer() {
  if (server === null) {
    server = initHttpServer().http
    ipAddress = getLocalIPAddress()
    if (ipAddress) {
      clipboard.writeText(`https://${ipAddress}:3001`)
      const menuTemplate = [
        {
          label: 'Servidor',
          submenu: [
            {
              label: `Servidor en https://${ipAddress}:3001`,
              click: () => {
                clipboard.writeText(`https://${ipAddress}:3001`);
                dialog.showMessageBox(mainWindow, {
                  title: 'Miscellaneous',
                  message: 'La dirección del servidor se copió al portapapeles.',
                  type: 'info',
                })
              },
            },
            {
              label: 'Detener servidor',
              click: stopServer,
            }
          ]
        },
        {
          label: 'Exportar certificado',
          click: exportCertificate
        }
      ]
      const menu = Menu.buildFromTemplate(menuTemplate)
      Menu.setApplicationMenu(menu)
    } else {
      dialog.showErrorBox('Error', 'No se pudo obtener la dirección IP local.')
    }
  }
}

async function stopServer() {
  if (server !== null) {
    await new Promise(resolve => server.close(resolve))
    server = null
    const menuTemplate = [
      {
        label: 'Servidor',
        submenu: [
          {
            label: 'Iniciar servidor',
            click: startServer
          }
        ]
      },
      {
        label: 'Exportar certificado',
        click: exportCertificate
      }
    ]
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      createMenu()
    }
  })
})

app.on('before-quit', async (event) => {
  if (server) {
    event.preventDefault()
    await stopServer()
    app.quit()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

if (require('electron-squirrel-startup')) app.quit()