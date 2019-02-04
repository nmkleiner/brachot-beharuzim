'use strict'

var gImgs;
var gMeme = {
    selectedImgId: undefined,
    txts: [
        {
            lines: [''],
            fontSize: 45,
            lineY: 0,
            lineYRange: [],
            lineX: 0,
            lineXRange: [],
            fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            align: 'center',
            fillColor: '#000000',
            strokeColor: '#000000',
            isSelected: false
        }
    ]
}
var gCategoryCountMap = {
    happy: 3,
    sad: 2,
    animal: 1,
    funny: 5,
    bad: 4,
}





function setCategoriesForStorgae() {
    var keys = Object.keys(gCategoryCountMap)
    var vals = Object.values(gCategoryCountMap)
    for (var i = 0; i < keys.length; i++) {
        saveToStorage(keys[i], vals[i])
    }
}


function getAllStorage() {
    if (jQuery.isEmptyObject(gCategoryCountMap)) return false ;
    else {
        var values = []
        var keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            var currKey = keys[i];
            var currVal = localStorage.getItem(keys[i]);
            var currKeyVal = [currKey, currVal]
            values.push(currKeyVal);
        }
        return values;
    }
}


function createImgs() {

    const imgCount = 2
    let imgs = []
    imgs.length = imgCount
    imgs.fill('',0,imgCount)
    imgs = imgs.map((_,idx) => {
        return {id: `00${idx + 1}`, url: `img/00${idx+1}.jpg`}
    })
    console.log(imgs)
    gImgs = imgs;
}


function getImgs() {
    return gImgs;
}

function setMemeByImgId(imgId) {
    gCurrImg = gImgs.find(img => {
        return (+(img.id) === imgId);
    })
    gMeme.selectedImgId = gCurrImg.id;
}

function getMeme() {
    return gMeme;
}

function addText(txtLoc, paragraph) {
    gMeme.txts[txtLoc].lines = splitToLines(paragraph);
}


function splitToLines(paragraph) {
    let lines = paragraph.split('.')
    lines = lines.filter(line => line !== '')
    lines = lines.map(line => {
        let lastChar = '.'
        if (line.charAt(line.length - 1) === ',') {
            lastChar = ','
            line = removeLastLetter(line)
        }
        if (line.charAt(line.length - 1) === '!') {
            lastChar = '!'
            line = removeLastLetter(line)
        }
        if (line.charAt(line.length - 1) === '-') {
            lastChar = ' -'
            line = removeLastLetter(line)
        }
        line = line.trim()
        return line = lastChar + line
    })
    return lines
}

function removeLastLetter(str) {
    str = str.split('')
    str.pop()
    str = str.join('')
    return str
}

function changeFillColor(color, currTxtLoc) {
    var currTxt = gMeme.txts[currTxtLoc];
    currTxt.fillColor = color;
}

function changeStrokeColor(color, currTxtLoc) {
    var currTxt = gMeme.txts[currTxtLoc];
    currTxt.strokeColor = color;
}

function changeFontSize(fontSizeNum, currTxtLoc) {
    var currTxt = gMeme.txts[currTxtLoc];
    currTxt.fontSize += fontSizeNum;
}



function getOffset() {
    var left = gCanvas.offsetLeft;
    var top = gCanvas.offsetTop + 40;
    return { left, top }
}


function initFirstLine() {
    if (!gMeme.txts[0].lineX) {
        for (var i = 0; i < gMeme.txts.length; i++) {
            var txt = gMeme.txts[i]
            const idx = findLongestLineIdx(txt.lines)
            // init line x
            var fontFactor = 0.5;
            txt.lineX = gCanvas.width / 2
            txt.lineXRange = [
                txt.lineX - (txt.lines[idx].length * txt.fontSize * fontFactor) / 2,
                txt.lineX + (txt.lines[idx].length * txt.fontSize * fontFactor) / 2
            ]

            // init line Y
            var factor = 1
            if (i === 1) var factor = 4
            txt.lineY = gCanvas.height * factor / 5
            txt.lineYRange = [
                txt.lineY - txt.fontSize,
                txt.lineY + txt.fontSize * txt.lines.length
            ]

        }
    }
}

function updateX(xDiff) {
    var txt = gMeme.txts[gCurrTxtLoc]
    if (xDiff) txt.lineX += xDiff
    const idx = findLongestLineIdx(txt.lines)
    var fontFactor = 0.5;
    txt.lineXRange = [
        txt.lineX - (txt.lines[idx].length * txt.fontSize * fontFactor) / 2,
        txt.lineX + (txt.lines[idx].length * txt.fontSize * fontFactor) / 2
    ]
}

function findLongestLineIdx(lines) {
    const lineLengths = lines.map(line => line.length)
    const maxLength = Math.max(...lineLengths)
    return lineLengths.findIndex(lineLength => lineLength === maxLength)
}

function updateY(yDiff) {
    var txt = gMeme.txts[gCurrTxtLoc]
    if (yDiff) txt.lineY += yDiff
    txt.lineYRange = [
        txt.lineY - txt.fontSize,
        txt.lineY + txt.fontSize * txt.lines.length
    ]
}

function pushToTextarea(paragraph) {
    $('#txt-editor').html(paragraph)
}

function createNewText(loc) {
    if (loc === 'center') {
        var lineY = gCanvas.height / 2;
    } else {
        var lineY = gCanvas.height * 4 / 5;
    }
    gMeme.txts.push({
        lines: ['פסקה חדשה.'],
        fontSize: 45,
        lineY,
        lineYRange: [],
        lineX: gCanvas.width / 2,
        lineXRange: [],
        fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
        align: 'center',
        fillColor: '#000000',
        strokeColor: '#000000',
        isSelected: false
    })
    var newLineIdx = gMeme.txts.length - 1;
    initNewLine(newLineIdx)
}



function initNewLine(line) {
    var txt = gMeme.txts[line]
    var fontFactor = 0.5;
    txt.lineXRange = [
        txt.lineX - (txt.lines[0].length * txt.fontSize * fontFactor) / 2,
        txt.lineX + (txt.lines[0].length * txt.fontSize * fontFactor) / 2
    ]
    txt.lineYRange = [
        txt.lineY - txt.fontSize,
        txt.lineY + txt.fontSize * txt.lines.length
    ]

}

function deleteText(idx) {
    gMeme.txts.splice(idx, 1)
}

function initCaption() {
    document.querySelector('#txt-editor').value = 'פסקה חדשה.'
}


// function listenToEnter() {
//     var elCaption = document.querySelector('.caption')
//     elCaption.addEventListener('keypress', function (ev) {
//         var key = ev.which || e.keyCode;
//         if (key === 13) { 
//           renderCanvas()
//         }
//     });
// }