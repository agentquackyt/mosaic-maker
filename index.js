const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("imageInput");
const number = document.getElementById("pixel_value");

let bitmap = [];

async function display(e) {
  bitmap = [];
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = async function () {

      canvas.width = 210/number.value;
      canvas.height = 297/number.value;
      ctx.drawImage(img, 0, 0, 210/number.value, 297/number.value);
      await greyScale();
      console.log("Berechnung beendet")
      tableCanvas()
    };
    console.log("Berechnung gestartet")
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

input.addEventListener("change", display);
number.addEventListener("change", display);


async function greyScale() {
  const grey_values = [255, 212, 170, 135,100, 85, 42, 0];
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let grey = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Find the closest grey value from the array
    grey = grey_values.reduce((a, b) => Math.abs(b - grey) < Math.abs(a - grey) ? b : a);

    data[i] = grey;     // red
    data[i + 1] = /*grey*/grey; // green
    data[i + 2] = /*grey*/grey; // blue
    data[i + 3] = 255;  // alpha

    bitmap[i/4] = getColorIndex(grey);
  }

  ctx.putImageData(imageData, 0, 0);
}

/*
async function tableCanvas() {
  const outputCanvas = document.getElementById("output");
  const ctx2 =  outputCanvas.getContext("2d");
  outputCanvas.width = (210/number.value)*20;
  outputCanvas.height = (297/number.value)*20;
  drawLine(ctx2, 0, 2, (10/number.value)*20, 2, "red", 2);
  drawLine(ctx2, (10/number.value)*20, 2, (10/number.value)*40, 2, "yellow", 2);
  drawLine(ctx2, (10/number.value)*40, 2, (10/number.value)*60, 2, "red", 2);
  
  for (let x = 0; x < (210/number.value); x++) {
    drawLine(ctx2, x*20, 0, x*20, outputCanvas.height);

  }
  for (let y = 0; y < (297/number.value); y++) {
    drawLine(ctx2, 0, y*20, outputCanvas.width, y*20);
  }
  ctx2.font = "15px sans-serif";

  for (let x = 0; x < outputCanvas.width; x++) {
    for (let y = 0; y < outputCanvas.height; y++) {
      
      ctx2.fillText(getColorIndex(bitmap[(x*outputCanvas.width)+y]), (x*20)+10, (y*20)+10);
    }
  }
  console.log(bitmap)
}
*/
async function tableCanvas() {
  
  const grey_values = [255, 212, 170, 135,100, 85, 42, 0];
  const outputCanvas = document.getElementById("output");
  const ctx2 =  outputCanvas.getContext("2d");
  ctx2.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  outputCanvas.width = (210/number.value)*20;
  outputCanvas.height = (297/number.value)*20;
  ctx2.imageSmoothingEnabled =false;
  ctx2.drawImage(canvas, 0,0,canvas.width*20,canvas.height*20);
  drawLine(ctx2, 0, 2, (10/number.value)*20, 2, "red", 2);
  drawLine(ctx2, (10/number.value)*20, 2, (10/number.value)*40, 2, "yellow", 2);
  drawLine(ctx2, (10/number.value)*40, 2, (10/number.value)*60, 2, "red", 2);
  
  for (let x = 0; x < (210/number.value); x++) {
    drawLine(ctx2, x*20, 0, x*20, outputCanvas.height);
  }
  for (let y = 0; y < (297/number.value); y++) {
    drawLine(ctx2, 0, y*20, outputCanvas.width, y*20);
  }
  
  console.log(bitmap)
}


function drawLine(ctx, x1, y1, x2,y2, stroke = 'black', width = 1) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function getColorIndex(i) {
  const grey_values = [255, 212, 170, 135,100, 85, 42, 0];
  for (let c = 0; c < grey_values.length; c++) {
    if(i==grey_values[c]) return grey_values[c];
  }
}