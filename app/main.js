const { app, BrowserWindow, ipcMain, Menu, clipboard, dialog } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')

process.env.IS_DEV = process.env.IS_DEV !== undefined
process.env.BASE_DIR = process.env.IS_DEV !== 'false' ? process.cwd() : path.join(app.getPath('userData'), 'server')
if (!fs.existsSync(process.env.BASE_DIR)) {
  fs.mkdirSync(process.env.BASE_DIR, { recursive: true })
}

const { initWorkerServer, initHttpServer } = require('./dist/server/main')
const workerServer = initWorkerServer()

ipcMain.handle('worker', (_, ...args) => workerServer(...args))

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces()
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal && interfaceInfo.address.split('.')[0] === '192') {
        return interfaceInfo.address
      }
    }
  }
  return 'localhost'
}

let ipAddress = null
let mainWindow
let server = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if (process.env.IS_DEV !== 'false') {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

function createMenu() {
  const menuTemplate = [
    {
      label: 'Servidor',
      submenu: [
        {
          label: 'Iniciar servidor',
          click: (menuItem, browserWindow, event) => startServer(menuItem)
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function startServer() {
  if (server === null) {
    server = initHttpServer().http
    ipAddress = getLocalIPAddress();
    if (ipAddress) {
      clipboard.writeText(`http://${ipAddress}:3001`)
      const menuTemplate = [
        {
          label: 'Servidor',
          submenu: [
            {
              label: `Servidor en http://${ipAddress}:3001`,
              click: () => {
                clipboard.writeText(`http://${ipAddress}:3001`);
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