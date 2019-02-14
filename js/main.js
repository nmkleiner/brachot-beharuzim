'use strict'

var gScreenSizes = {};
var gCanvas
var gOffset = {}
var gCtx
var gCurrImg = {}
var gCurrTxtLoc


function init() {
    console.log('init')
    // listenToEnter()
    gScreenSizes = getScreenSizes()
    createImgs()
    renderImgs()
    // initCanvas()
    const elImg = document.querySelector('#img-001')
    setTimeout(() => setCanvas(elImg,1),50)
}

function onGalleryImgClick(elImg, imgId) {
    console.log('onGalleryImgClick')
    setCanvas(elImg, imgId)
}

function setCanvas(elImg, imgId) {
    console.log('setCanvas')
    initCanvas()
    initMeme()
    setMemeByImgId(imgId)
    gCurrImg = createImg(elImg.src)
    setCanvasImg(elImg)
    drawImage(gCurrImg)
}

function initCanvas() {
    console.log('initCanvas')

    if (gCanvas) return;
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
}


function renderImgs() {
    console.log('renderImgs')
    var imgs = getImgs();
    var elImgsContainer = document.querySelector('.imgs-container')
    var strHtmls = ''
    for (let i = 0; i < imgs.length; i++) {
        const currImgUrl = imgs[i].url;
        const currImgId = imgs[i].id;
        const strHtml = `<img 
            id="img-${currImgId}"  
            class="gallery-img" 
            src="${currImgUrl}" 
            alt="Img Here" 
            onclick="onGalleryImgClick(this, ${currImgId})
        ">`;
        strHtmls += strHtml;
    }
    elImgsContainer.innerHTML = strHtmls;
}

function onColorChange(color) {
    console.log('onColorChange')
    changeFillColor(color, gCurrTxtLoc);
    renderCanvas()
}

function onTxtChange(value) {
    console.log('onTxtChange')
    addText(gCurrTxtLoc, value);
    updateX(0)
    renderCanvas()
}

function onUpperTxtChange(value) {
    console.log('onUpperTxtChange')
    addText(0, value);
    pushToTextarea(value);
    updateX(0)
    initNewLine(0)
    renderCanvas()
}

function onLowerTxtChange(value) {
    console.log('onLowerTxtChange')
    addText(1, value);
    pushToTextarea(value);
    updateX(0)
    initNewLine(1)
    renderCanvas()
}







function onTxtFocus() {
    console.log('onTxtFocus')
    if (!gCurrTxtLoc) gCurrTxtLoc = 0;
    if (!gMeme.txts[0]) createNewText();
}

function onFontSizeClick(fontSizeNum) {
    console.log('onFontSizeClick')
    changeFontSize(fontSizeNum)
    updateX(0)
    updateY(0)
    renderCanvas()
}

function onDownload(elLink) {
    console.log('onDownload')
    elLink.href = gCanvas.toDataURL()
    elLink.download = 'new-cool-meme.jpg'
}



function createImg(imgSrc) {
    console.log('createImg')
    var img = new Image()
    img.src = imgSrc
    return img
}

function onResize() {
    console.log('onResize')
    if (!gCanvas) return;
    setCanvasImg()
    drawImage(gCurrImg)
}

function setCanvasImg() {
    console.log('setCanvasImg')
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
    console.log('drawImage')
    // console.log(img)
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function onCanvasClick(ev) {
    var x = ev.clientX - gOffset.left;
    var y = ev.clientY - gOffset.top;
    console.log('x,y', x, y)
    var texts = gMeme.txts
    var lineIdx = gMeme.txts.findIndex(txt => {
        var botY = txt.lineYRange[1];
        var topY = txt.lineYRange[0];
        var leftX = txt.lineXRange[0];
        var rightX = txt.lineXRange[1];
        console.log('x-x,y-y', leftX, '-', rightX, ',', botY, '-', topY)
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
    console.log('onXChange')
    updateX(xDiff, gCurrTxtLoc)
    renderCanvas()
}

function onYChange(yDiff) {
    console.log('onYChange')
    updateY(yDiff, gCurrTxtLoc)
    renderCanvas()
}

function drawFrame(line) {
    console.log('drawFrame')
    var txt = gMeme.txts[line]
    gCtx.beginPath()
    gCtx.save()
    gCtx.strokeStyle = 'orangered'
    gCtx.rect(txt.lineXRange[0] - 10, txt.lineYRange[0],
        txt.lineXRange[1] - txt.lineXRange[0] + 10, txt.lineYRange[1] - txt.lineYRange[0] - 10);
    gCtx.stroke();
    gCtx.restore();
}




function onRemoveLine() {
    console.log('onRemoveLine')
    deleteText(gCurrTxtLoc)
    document.querySelector('.caption').value = ''
    renderCanvas()
}


function renderCanvas() {
    console.log('renderCanvas')
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
        gCtx.textAlign = currTxt.align
        // draws the text in the canvas
        currTxt.lines.forEach((line, idx) => {
            let lineY = currTxt.lineY + (idx * currTxt.fontSize)
            gCtx.fillText(line, lineX, lineY)
        })
    }
}

