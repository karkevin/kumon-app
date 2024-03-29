const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const ipcMain = electron.ipcMain;


/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'pycalcdist'
const PY_FOLDER = 'backend'
const PY_MODULE = 'api' // without .py suffix

let pyProc = null
let pyPort = 54321

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + pyPort

  if (guessPackaged()) {
    pyProc = require('child_process').execFile(script, [port])
  } else {
    pyProc = require('child_process').spawn('python', [script, port])
  }

  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


/*************************************************************
 * window management
 *************************************************************/

let homeWindow = null
let win = null

const createWindow = () => {
  homeWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })
  homeWindow.loadFile('src/mark.html');
  homeWindow.webContents.openDevTools();

  homeWindow.on('closed', () => {
    homeWindow = null
  })

}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (homeWindow === null) {
    createWindow()
  }
})

ipcMain.on('load-page', (event, arg) => {
  homeWindow.loadFile(arg);
});

ipcMain.on('page-number', (event, arg) => {
  homeWindow.webContents.send('pageNumber', arg);
});

ipcMain.on('display-image', (event, arg) => {
    win = new BrowserWindow({
      width: 600,
      height: 500,
      frame: false,
      alwaysOnTop: true,
      parent: homeWindow,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    });
    win.loadFile('src/popUpImage.html');

  win.on('close', (event) => {
      win = null;
  })
  win.once('ready-to-show', () => {
    // win.webContents.openDevTools();
    win.webContents.send('displayImage', arg);
    win.show();
  });
});