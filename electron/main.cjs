const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#0f0d13',
    // On ne définit pas l'icône ici pour éviter les erreurs de chemin, 
    // elle sera gérée par electron-builder pour le .exe
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    // Dans le build, main.cjs est dans resources/app.asar/electron/
    // On remonte d'un cran pour trouver dist/
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
    });
  }
  
  // Masquer la barre de menu pour un look plus "app"
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
