const electron = require('electron');
const path = require('path');
const remote = require('electron').remote;
const ipc = electron.ipcRenderer;
const BrowserWindow = electron.remote.BrowserWindow;

//zeromq stuff
const zerorpc = require("zerorpc")
let client = new zerorpc.Client()
client.connect("tcp://localhost:54321")
let stdNumber = document.querySelector('#std-number')
let result = document.querySelector('#result')
let booklet_number = document.querySelector('#booklet');

// var scanText = document.getElementById("scan-text");
// var scanButton = document.getElementById("scan-button");
var markText = document.getElementById("mark-text");
var markButton = document.getElementById("mark-button");
var printText = document.getElementById("print-text");
var printButton = document.getElementById("print-button");
var resetButton = document.getElementById("reset-button")
// scanButton.disabled = true;
markButton.disabled = true;
// printButton.disabled = true;


client.invoke("echo", "server ready", (error, res) => {
    if (error || res !== 'server ready') {
        console.error(error)
    } else {
        console.log("server is ready")
    }
})

function getRadioValue() {
    var booklet_number = document.querySelector('#booklet');
    for (let i = 0; i < booklet_number.children.length; i++) {
        var child = booklet_number.children[i];
        var input = child.firstChild;
        if (input.checked) {
            return Number(input.value);
        }
    }
}

document.getElementById("home").addEventListener('click', function (event) {
    ipc.send('load-page', 'src/home.html');
});

document.getElementById("enter-button").addEventListener('click', function (event) {
    client.invoke("check_number", Number(stdNumber.value), (error, res) => {
        if (error) {
            alert("Invalid Student number. Please try again.");
        } else {
            document.getElementById("check-mark").style.visibility = "visible";
            booklet();
        }
    })
})

function booklet() {
    document.getElementById("booklet").addEventListener('click', function (event) {
        markText.innerHTML = "Ready to Mark Student " + stdNumber.value;
        markButton.disabled = false;
    });
}

markButton.addEventListener('click', function (event) {
    markText.innerHTML = "Marking Student " + stdNumber.value;
    markButton.disabled = true;

    var booklet_value = getRadioValue();
    client.invoke("mark", Number(stdNumber.value), booklet_value, (error, res) => {
        if (res) {
            markText.innerHTML = "Finished Marking Student " + stdNumber.value;
            markButton.disabled = false;
        }
    });
});

printButton.addEventListener('click', function () {
    client.invoke("display_image", (error, res) => {
        if (res) {
            console.log(String(res));
            ipc.send('display-image', String(res));
        }
    })
    ipc.once('pageNumber', (event, arg) => {
        client.invoke("get_path_number", arg, (error, res) => {
            if (res) {
                console.log(res);
            }
        })
    })
});

resetButton.addEventListener('click', () => {
    var thisWindow = remote.getCurrentWindow();
    var win = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        parent: thisWindow,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    resetButton.disabled = true;
    win.loadFile('src/loading.html');

    client.invoke("reset", (error, res) => {
        if (res) {
            console.log("hey");
            win.close();
            resetButton.disabled = false;
        }
    })

})





