const electron = require('electron');
const path = require('path');
const remote = require('electron').remote;
const ipc = electron.ipcRenderer;

var scanText = document.getElementById("scan-text");
var scanButton = document.getElementById("scan-button");
var markText = document.getElementById("mark-text");
var markButton = document.getElementById("mark-button");
var printText = document.getElementById("print-text");
var printButton = document.getElementById("print-button");
scanButton.disabled = true;
markButton.disabled = true;
printButton.disabled = true;

var stdNumber;

document.getElementById("home").addEventListener('click', function (event) {
    ipc.send('load-page', 'src/home.html');
});

// checks if the student number is acceptable.
function checkNumber(num) {
    console.log(num);
    if (Number.isNaN(num)) {
        alert("Invalid Student number. Please try again.");
        return false;
    }
    else if (num === 0) {
        alert("Invalid Student number. Please try again.");
        return false;
    }
    return true;
}

document.getElementById("enter-button").addEventListener('click', function (event) {
    stdNumber = document.getElementById("std-number").value;
    if (checkNumber(Number(stdNumber))) {
        document.getElementById("check-mark").style.visibility = "visible";
        booklet();
    }
})

function booklet() {
    document.getElementById("booklet").addEventListener('click', function (event) {
        scanText.innerHTML = "Ready to Scan " + stdNumber;
        scanButton.disabled = false;
    });
}

scanButton.addEventListener('click', function(event) {
    scanText.innerHTML = "Scanning " + stdNumber;
    scanButton.disabled = true;
    //Socket stuff
    

})
