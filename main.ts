import {app, BaseWindow, BrowserWindow} from 'electron'
import * as path from 'path'

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 700,
    });

    win.loadFile(path.join(__dirname, '../public/index.html'))
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BaseWindow.getAllWindows().length === 0) createWindow(); 
})