'use strict'

var gImgs;
var gMeme;
var gCategoryCountMap = {
    happy: 3,
    sad: 2,
    animal: 1,
    funny: 5,
    bad: 4,
}






function createImgs() {
    console.log('createImgs')
    const imgCount = 2
    let imgs = []
    imgs.length = imgCount
    imgs.fill('',0,imgCount)
    imgs = imgs.map((_,idx) => {
        return {id: `00${idx + 1}`, url: `img/00${idx+1}.jpg`}
    })
    gImgs = imgs;
}


function getImgs() {
    console.log('getImgs')
    return gImgs;
}

function initMeme() {
    console.log('initMeme')    
    gMeme = {
        selectedImgId: undefined,
        txts: [
            {
                lines: [''],
                fontSize: 32,
                lineY: 0,
                lineYRange: [],
                lineX: 0,
                lineXRange: [],
                fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
                align: 'center',
                fillColor: '#000000',
                isSelected: false
            },
            {
                lines: [''],
                fontSize: 32,
                lineY: 0,
                lineYRange: [],
                lineX: 0,
                lineXRange: [],
                fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
                align: 'center',
                fillColor: '#000000',
                isSelected: false
            }
        ]
    }
}

function setMemeByImgId(imgId) {
    console.log('setMemeByImgId')    
    gCurrImg = gImgs.find(img => {
        return (+(img.id) === imgId);
    })
    gMeme.selectedImgId = gCurrImg.id;
}

function getMeme() {
    console.log('getMeme')   
    return gMeme;
}



function changeFillColor(color, currTxtLoc) {
    console.log('changeFillColor')   
    var currTxt = gMeme.txts[currTxtLoc];
    currTxt.fillColor = color;
}

function changeFontSize(fontSizeNum) {
    console.log('changeFontSize')  

    gMeme.txts.forEach(txt => {
        txt.fontSize += fontSizeNum;
    })
}



function getOffset() {
    console.log('getOffset')   
    var left = gCanvas.offsetLeft;
    var top = gCanvas.offsetTop + 90;
    return { left, top }
}


function initFirstLine() {
    console.log('initFirstLine')   
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
            if (i === 1) var factor = 5
            txt.lineY = gCanvas.height * factor / 8
            txt.lineYRange = [
                txt.lineY - txt.fontSize,
                txt.lineY + txt.fontSize * txt.lines.length
            ]

        }
    }
}

function updateX(xDiff) {
    console.log('updateX')   
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
    console.log('findLongestLineIdx')   
    const lineLengths = lines.map(line => line.length)
    const maxLength = Math.max(...lineLengths)
    return lineLengths.findIndex(lineLength => lineLength === maxLength)
}

function updateY(yDiff) {
    console.log('updateY')   
    var txt = gMeme.txts[gCurrTxtLoc]
    if (yDiff) txt.lineY += yDiff
    txt.lineYRange = [
        txt.lineY - txt.fontSize,
        txt.lineY + txt.fontSize * txt.lines.length
    ]
}

function pushToTextarea(paragraph) {
    console.log('pushToTextarea')   
    $('#txt-editor').html(paragraph)
}



function initNewLine(line) {
    console.log('initNewLine')   
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
    console.log('deleteText')   
    gMeme.txts[idx].lines = []
}


function listenToEnter() {
    console.log('listenToEnter')   
    var elCaption = document.querySelector('#txt-editor')
    elCaption.addEventListener('keypress', function (ev) {
        var key = ev.which || e.keyCode;
        if (key === 13) { 
            console.log('enter')
            // go one row down
        
        }
    });
}


function addText(txtLoc, paragraph) {
    console.log('addText')   
    gMeme.txts[txtLoc].lines = splitToLines(paragraph);
}


function splitToLines(paragraph) {
    console.log('splitToLines')   
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
    console.log('removeLastLetter')   
    str = str.split('')
    str.pop()
    str = str.join('')
    return str
}


// function createNewText(loc) {
//     console.log('createNewText')   
//     var lineY = gCanvas.height * 4 / 5;
//     gMeme.txts.push({
//         lines: ['פסקה חדשה.'],
//         fontSize: 45,
//         lineY,
//         lineYRange: [],
//         lineX: gCanvas.width / 2,
//         lineXRange: [],
//         fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
//         align: 'center',
//         fillColor: '#000000',
//         isSelected: false
//     })
//     var newLineIdx = gMeme.txts.length - 1;
//     initNewLine(newLineIdx)
// }
