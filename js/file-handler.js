// Referências aos elementos HTML 
const btnInputImg = document.querySelector('#btnInputImg');
const btnSave = document.querySelector('#btnSave');
const btnFlipVertical = document.querySelector('#btnFlipVertical');
const btnFlipHorizontal = document.querySelector('#btnFlipHorizontal');
const btnGrayScale = document.querySelector('#btnGrayScale');
const btnInvertColors = document.querySelector('#btnInvertColors');
const btnCancelChanges = document.querySelector('#btnCancelChanges');
const fileInputImg = document.querySelector('#fileInputImg');
const imgPreviewOrig = document.querySelector('#imgOriginal');
const imgEdited = document.querySelector('#imgModific');
const inputRangeTones = document.querySelector('#colorTones');
const colorTonesView = document.querySelector('#colorTonesView');
const labelBtnGrayScale = document.querySelector('#labelBtnGrayScale');

// Imagens suportadas pelo sistema
const fileTypes = [
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
disableEditing();

// Verifica se o tipo de um arquivo é valido 
function typeIsValid (file) {
    return fileTypes.includes(file.type);
}

// Carrega a imagem no campo "Imagem Original"
function loadImg () {
    const file = fileInputImg.files[0];

    if (!file) {
        alert('Não foi possível abrir uma imagem.');
        return;
    } 
    
    if (typeIsValid(file)) {
        imgPreviewOrig.src = URL.createObjectURL(file);
        imgEdited.src = URL.createObjectURL(file);
        enableEditing();
    }
    else {
        alert('Tipo de arquivo inválido.');
        return;
    }
}

// Carrega a imagem no campo "Imagem Modificada"
function loadImgCanvas() {
    canvas.width = imgEdited.width;
    canvas.height = imgEdited.height;
    ctx.drawImage(imgEdited, 0, 0, imgEdited.width, imgEdited.height);
}

// Atualiza o display do contador de tons
function updateColorToneView() {
    if (Number(inputRangeTones.value) < maxInputRangeTones) {
        colorTonesView.innerHTML = Number(inputRangeTones.value);
        maxInputRangeTones = Number(inputRangeTones.value);
    }
    else
        inputRangeTones.value = maxInputRangeTones;
}

// Desabilita a edição da imagem
function disableEditing () {
    btnFlipVertical.disabled = true;
    btnFlipHorizontal.disabled = true;
    btnGrayScale.disabled = true;
    btnInvertColors.disabled = true;
    btnCancelChanges.disabled = true;
    inputRangeTones.disabled = true;
    btnSave.disabled = true;
}

// Habilita a edição da imagem
function enableEditing () {
    btnFlipVertical.disabled = false;
    btnFlipHorizontal.disabled = false;
    btnGrayScale.disabled = false;
    btnInvertColors.disabled = false;
    btnCancelChanges.disabled = false;
    inputRangeTones.disabled = false;
    btnSave.disabled = false;
    inputRangeTones.value = 255;
    colorTonesView.innerHTML = 255;
    maxInputRangeTones = 255;
}

// Salva a imagem
function saveImage () {
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

// Cancela alterações
function cancelChanges () {
    loadImgCanvas(); 
    enableEditing();
}

// Eventos
fileInputImg.addEventListener('change', loadImg);
imgEdited.addEventListener('load', loadImgCanvas);
btnFlipHorizontal.addEventListener('click', flipsHorizontal);
btnFlipVertical.addEventListener('click', flipsVertical);
btnGrayScale.addEventListener('click', convertToGrayscale);
btnInvertColors.addEventListener('click', invertColors);
btnCancelChanges.addEventListener('click', cancelChanges);
btnSave.addEventListener('click', saveImage);
inputRangeTones.addEventListener('change', toneQuantization);
inputRangeTones.addEventListener('input', updateColorToneView);