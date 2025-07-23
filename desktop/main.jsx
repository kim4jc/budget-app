const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:5173'); // Dev server during development
  // Or use win.loadFile('path-to-build/index.html') after production build
}
