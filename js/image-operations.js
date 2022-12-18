// Inverte a imagem horizontalmente
function flipsHorizontal () {
    const imgData = ctx.getImageData(0, 0, imgEdited.width, imgEdited.height);
    const imgPxMatrix = imgData.data;    // Obtém uma matriz de pixels da imagem
    var imgDataWidth = imgData.width * 4;
    var aux = 0, elementIndex = 0, symmetricIndex = 0;

    for (var row = 0; row < imgData.height; row++) {
        for (var col = 0; col < imgDataWidth / 2 - 1; col += 4) {
            for (var i = 3; i >= 0; i--) {
                elementIndex = col + (row * imgDataWidth) + (3 - i);
                symmetricIndex = (imgDataWidth - 1) - col + (row * imgDataWidth) - i; 
                aux = imgPxMatrix[elementIndex];
                imgPxMatrix[elementIndex] = imgPxMatrix[symmetricIndex];
                imgPxMatrix[symmetricIndex] = aux;
            }
        }
    }
    ctx.putImageData(imgData, 0, 0); 
}

// Inverte a imagem verticalmente
function flipsVertical () {
    const imgData = ctx.getImageData(0, 0, imgEdited.width, imgEdited.height);
    const imgPxMatrix = imgData.data;    // Obtém uma matriz de pixels da imagem
    var imgDataWidth = imgData.width * 4;
    var imgDataHeight = imgData.height;

    for (var col = 0; col < imgDataWidth; col++) {
        for (var row = 0; row < imgDataHeight / 2; row++) {
            elementIndex = col + (row * imgDataWidth);
            symmetricIndex = (imgDataWidth - 1) * (imgDataHeight - row) + (imgDataHeight - row) + col; 
            aux = imgPxMatrix[elementIndex];
            imgPxMatrix[elementIndex] = imgPxMatrix[symmetricIndex];
            imgPxMatrix[symmetricIndex] = aux;
        }
    } 
    ctx.putImageData(imgData, 0, 0); 
}

// Converte imagem em tons de cinza
function convertToGrayscale () {
    const imgData = ctx.getImageData(0, 0, imgEdited.width, imgEdited.height);
    const imgPxMatrix = imgData.data; // Obtém uma matriz de pixels da imagem

    for (var i = 0; i < imgPxMatrix.length; i += 4) {
        imgPxMatrix[i] = imgPxMatrix[i] * 0.299 + 
                        imgPxMatrix[i + 1] * 0.587 + 
                        imgPxMatrix[i + 2] * 0.114; // R
        imgPxMatrix[i + 1] = imgPxMatrix[i];        // G
        imgPxMatrix[i + 2] = imgPxMatrix[i];        // B
    }
    ctx.putImageData(imgData, 0, 0);
}

// Inverte as cores da imagem
function invertColors () {
    const imgData = ctx.getImageData(0, 0, imgEdited.width, imgEdited.height);
    const imgPxMatrix = imgData.data; // Obtém uma matriz de pixels da imagem
    
    for (var i = 0; i < imgPxMatrix.length; i += 4) {
            imgPxMatrix[i] = 255 - imgPxMatrix[i];          // red  - 0 to 255
            imgPxMatrix[i + 1] = 255 - imgPxMatrix[i + 1];  // green - 0 to 255
            imgPxMatrix[i + 2] = 255 - imgPxMatrix[i + 2];  // blue - 0 to 255
            imgPxMatrix[i + 3] = 255;                       // alpha - 0 to 255
    }
    ctx.putImageData(imgData, 0, 0);
}

// Efetua a quantização de tons da imagem
function toneQuantization () {
    const imgData = ctx.getImageData(0, 0, imgEdited.width, imgEdited.height);
    const imgPxMatrix = imgData.data; 
    let higherTone = 0, smallerTone = 255, toneSize = 0, binSize = 0;
    let newToneValue;
    let tbMatrix = [];
    let numberOfTones = Number(inputRangeTones.value);   
    
    for (var i = 0; i < imgPxMatrix.length; i += 4) {
        if (imgPxMatrix[i] >= higherTone)
            higherTone = imgPxMatrix[i];
        if (imgPxMatrix[i] <= smallerTone)
            smallerTone = imgPxMatrix[i];
    }

    toneSize = higherTone - smallerTone + 1;
    binSize = toneSize / numberOfTones;

    for(var i = 0; i < numberOfTones; i++) {
        newToneValue = Math.round((smallerTone - 0.5 + i * binSize + smallerTone - 0.5 + (i + 1) * binSize) / 2);
        tbMatrix.push(newToneValue);
    }

    if (numberOfTones < toneSize) {
        for(var i = 0; i < numberOfTones; i++) {
            var tbMin = smallerTone - 0.5 + i * binSize;
            var tbMax = smallerTone - 0.5 + (i + 1) * binSize;
            for (var j = 0; j < imgPxMatrix.length; j += 4) {
                if (imgPxMatrix[j] >= tbMin && imgPxMatrix[j] < tbMax)
                    imgPxMatrix[j] = tbMatrix[i];
                if (imgPxMatrix[j + 1] >= tbMin && imgPxMatrix[j + 1] < tbMax)
                    imgPxMatrix[j + 1] = tbMatrix[i];
                if (imgPxMatrix[j + 2] >= tbMin && imgPxMatrix[j + 2] < tbMax)
                    imgPxMatrix[j + 2] = tbMatrix[i];                                        
            }
        }
    } 
    ctx.putImageData(imgData, 0, 0);
}