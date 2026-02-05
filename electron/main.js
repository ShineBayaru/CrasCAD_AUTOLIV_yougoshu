const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0b0c15',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simple migration. In production, consider strictly using preload scripts.
      webSecurity: false // To allow loading local images if needed
    },
    autoHideMenuBar: true
  });

  // In production, load the built index.html
  // In development, you might load localhost:5173
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // Fallback or dev mode logic (if running electron locally without vite dev server)
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});