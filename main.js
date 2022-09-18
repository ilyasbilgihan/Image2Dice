var image, url, diceSize, pixels, HORIZONTAL_DICE_COUNT = 80;
var diceData = [];
var res = document.querySelector("#result");
var diceInput = document.querySelector("#diceCount")


function openModal(url){
  res.innerHTML = ""
  diceData = []

  let uploadedImage = document.querySelector("img")
  uploadedImage.src = url
  let img = new Image()
  img.src = url

  img.onload = function(){
    let canvas = document.querySelector("canvas#grayscale");
    let ctx = canvas.getContext("2d");
    HORIZONTAL_DICE_COUNT = diceInput.value;
    
    diceSize = parseInt(img.width / HORIZONTAL_DICE_COUNT);
    canvas.width = img.width;
    canvas.height = img.height;
    
    if(diceSize != (img.width / HORIZONTAL_DICE_COUNT)){
      alert("Dice count is not a divisor of your image width")
      return
    }
    if(img.height % diceSize != 0){
      alert("Dice count is not a divisor of your image height")
      return
    }
    
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let imgData = ctx.getImageData(0, 0, img.width, img.height);
    pixels = imgData.data;
    
    for (var i = 0; i < pixels.length; i += 4 ) {
      
      let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

      pixels[i] = lightness;
      pixels[i + 1] = lightness;
      pixels[i + 2] = lightness;
      
    }
    ctx.putImageData(imgData, 0, 0);
    
    for(var y = 0; y < parseInt(img.height / diceSize); y++ ){
      
      let line = []
      
      for(var x = 0; x < HORIZONTAL_DICE_COUNT; x++ ){
        let topLeft = getIndexOfDice(x, y)
        let avg = calculateAvgColor(topLeft)
        line.push(parseInt(avg * 6 / 255) + 1)
      }
      
      diceData.push(line)
      
    }

    ctx.putImageData(imgData, 0, 0);
    let downloadArr = {}

    document.querySelector("#verticalDiceCount").innerText = "Vertical Dice Count: " + diceData.length
    document.querySelector("#totalDiceCount").innerText = "Total Dice Count: " + diceData.length * HORIZONTAL_DICE_COUNT
    res.style.gridTemplateColumns = "repeat(" + HORIZONTAL_DICE_COUNT + ", 1fr)"
    diceData.forEach((line, y) => {
      line.forEach((dice, x) => {
        let d = document.createElement("img")
        d.style.width = `calc(50vw / ${HORIZONTAL_DICE_COUNT})` 
        d.style.height = `calc(50vw / ${HORIZONTAL_DICE_COUNT})` 

        d.src = `./dice/${dice}.png`
        downloadArr[y + 1] ? downloadArr[y + 1].push(x + 1 + ": " + dice) : downloadArr[y + 1] = [x + 1 + ": " + dice]
        res.append(d)
          
      })
    })
    
    var downloadData = document.querySelector(".download")
    downloadData.download = "dice-data.json"; 
    downloadData.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloadArr));
    downloadData.innerHTML = "Download Dice Data";
    

  }
  
  
}

function getIndexOfDice(x, y){
  
  let index = (x * diceSize) + (y * HORIZONTAL_DICE_COUNT * diceSize * diceSize)
  return index * 4
  
}

function calculateAvgColor(topLeft){
  let total = 0;
  let count = 0
  for(let j = 0; j < diceSize; j++ ){
    for(let i = 0; i < diceSize * 4; i += 4){
      total += pixels[i + topLeft + (j * HORIZONTAL_DICE_COUNT * diceSize * 4)]
      count++
    }
  }
  let avg = parseInt(total / count)
  
  for(let j = 0; j < diceSize; j++ ){
    for(let i = 0; i < diceSize * 4; i += 4){
      pixels[i + topLeft + (j * HORIZONTAL_DICE_COUNT * diceSize * 4)] = avg;
      pixels[i + topLeft + (j * HORIZONTAL_DICE_COUNT * diceSize * 4) + 1] = avg;
      pixels[i + topLeft + (j * HORIZONTAL_DICE_COUNT * diceSize * 4) + 2] = avg;
    }
  }
  
  return avg
  
}


function setExample(id){
  if(id == 1){
    diceInput.value = 72
    openModal("./example/1.jpg")
  }
  if(id == 2){
    diceInput.value = 80
    openModal("./example/2.webp")
  }
  if(id == 3){
    diceInput.value = 80
    openModal("./example/3.jpg")
  }
}