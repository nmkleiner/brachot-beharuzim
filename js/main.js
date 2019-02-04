'use strict'

var gScreenSizes = {};
var gCanvas
var gOffset = {}
var gCtx
var gCurrImg = {}
var gCurrTxtLoc
var gFillOrStroke = 'fill';


function init() {
    gScreenSizes = getScreenSizes()
    setCategoriesForStorgae()
    createImgs()
    renderImgs()
    // initCanvas()
}




function initCanvas() {
    if (gCanvas) return;
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
}


function renderImgs() {
    var imgs = getImgs();
    var elImgsContainer = document.querySelector('.imgs-container')
    var strHtmls = ''
    for (let i = 0; i < imgs.length; i++) {
        var currImgUrl = imgs[i].url;
        var currImgId = imgs[i].id;
        var strHtml = `<img  class = "gallery-img" src="${currImgUrl}" alt="Img Here" onclick = "onGalleryImgClick(this, ${currImgId})">`;
        strHtmls += strHtml;
    }
    elImgsContainer.innerHTML = strHtmls;
}


function onBackBtn() {
    toggleModal()
}

function onFillOrStrokeChange(fillOrStroke) {
    gFillOrStroke = (fillOrStroke === 'stroke') ? 'stroke' : 'fill';

}

function onColorChange(color) {
    (gFillOrStroke === 'stroke') ? changeStrokeColor(color, gCurrTxtLoc) : changeFillColor(color, gCurrTxtLoc);
    renderCanvas()
}

function onTxtChange(value,isTextEditor) {
    // listenToEnter()
    gCurrTxtLoc;
    addText(gCurrTxtLoc, value);
    if (!isTextEditor) pushToTextarea(value);
    updateX(0)
    renderCanvas()
}

function onTxtFocus() {
    if (!gCurrTxtLoc) gCurrTxtLoc = 0;
    if (!gMeme.txts[0]) createNewText();
}

function onFontSizeClick(fontSizeNum) {
    changeFontSize(fontSizeNum, gCurrTxtLoc)
    updateX(0)
    updateY(0)
    renderCanvas()
}

function onDownload(elLink) {
    elLink.href = gCanvas.toDataURL()
    elLink.download = 'new-cool-meme.jpg'
}

function onGalleryImgClick(elImg, imgId) {
    initCanvas()
    setMemeByImgId(imgId)
    toggleModal()
    gCurrImg = createImg(elImg.src)
    setCanvas(elImg)
    drawImage(gCurrImg)
}

function createImg(imgSrc) {
    var img = new Image()
    img.src = imgSrc
    return img
}

function onResize() {
    if (!gCanvas) return;
    setCanvas()
    drawImage(gCurrImg)
}

function setCanvas() {
    var heightFactor = gCurrImg.height / gCurrImg.width

    if (window.innerWidth > 768) {
        gCanvas.width = 500
    } else {
        gCanvas.width = window.innerWidth

        if (window.innerHeight < window.innerWidth) {
            gCanvas.width = 500
            $('.caption').css('width', '500px')
        }
    }
    gCanvas.height = gCanvas.width * heightFactor

    gOffset = getOffset()
    initFirstLine()
}

function drawImage(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function onCanvasClick(ev) {
    var x = ev.clientX - gOffset.left;
    var y = ev.clientY - gOffset.top;
    var texts = gMeme.txts
    var lineIdx = gMeme.txts.findIndex(txt => {
        var botY = txt.lineYRange[1];
        var topY = txt.lineYRange[0];
        var leftX = txt.lineXRange[0];
        var rightX = txt.lineXRange[1];
        return (y < botY - 5 &&
            y > topY + 5 &&
            x > leftX - 5 &&
            x < rightX + 5)
    })
    texts.forEach(txt => {
        txt.isSelected = false;
    })
    if (lineIdx !== -1) {
        gCurrTxtLoc = lineIdx;
        gMeme.txts[gCurrTxtLoc].isSelected = true;
        document.querySelector('.caption').value = gMeme.txts[gCurrTxtLoc].lines
    }
    renderCanvas()
}

function onXChange(xDiff) {
    updateX(xDiff, gCurrTxtLoc)
    renderCanvas()
}

function onYChange(yDiff) {
    updateY(yDiff, gCurrTxtLoc)
    renderCanvas()
}

function drawFrame(line) {
    var txt = gMeme.txts[line]
    gCtx.beginPath()
    gCtx.save()
    gCtx.strokeStyle = 'orangered'
    gCtx.rect(txt.lineXRange[0] - 10, txt.lineYRange[0],
        txt.lineXRange[1] - txt.lineXRange[0] + 10, txt.lineYRange[1] - txt.lineYRange[0] - 10);
    gCtx.stroke();
    gCtx.restore();
}


function onAddNewLine(loc) {
    createNewText(loc)
    initCaption()
    renderCanvas()
}

function onRemoveLine() {
    deleteText(gCurrTxtLoc)
    document.querySelector('.caption').value = ''
    renderCanvas()
}


function renderCanvas() {
    var meme = getMeme();

    // draw img
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    drawImage(gCurrImg)

    var currTxt
    var lineX
    for (let i = 0; i < meme.txts.length; i++) {
        currTxt = meme.txts[i]
        if (currTxt.isSelected) {
            drawFrame(i)
        }
        lineX = currTxt.lineX;
        gCtx.font = `${currTxt.fontSize}px ${currTxt.fontFamily}`
        gCtx.fillStyle = currTxt.fillColor
        gCtx.strokeStyle = currTxt.strokeColor
        gCtx.textAlign = currTxt.align
        // draws the text in the canvas
        currTxt.lines.forEach((line,idx) => {
            let lineY = currTxt.lineY + (idx * currTxt.fontSize)
            gCtx.fillText(line, lineX, lineY)
            gCtx.strokeText(line, lineX, lineY)
        })
    }
}

