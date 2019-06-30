const electron = require('electron');
const path = require('path');
const remote = require('electron').remote;
const ipc = electron.ipcRenderer;


const markButton = document.getElementById("home");
markButton.addEventListener('click', function (event) {
    ipc.send('load-page', 'src/home.html')
})