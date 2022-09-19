var image, canvas, ctx, url, img, diceSize, pixels, HORIZONTAL_DICE_COUNT = 80;
var diceData = [];
var res = document.querySelector("#result");
var options = document.querySelector("#possibleDiceCounts")

function openModal(url){
  options.innerHTML = ""
  document.querySelector("#verticalDiceCount").innerText = "";
  document.querySelector("#totalDiceCount").innerText = "";
  document.querySelector(".download").innerHTML = "";
  res.innerHTML = ""
  
  if (ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  let uploadedImage = document.querySelector("img")
  uploadedImage.src = url
  img = new Image()
  img.src = url

  img.onload = function(){
    
    let possibilities = commDivs(img.width, img.height).map(i=>img.width/i).sort((a,b)=>a-b)
    possibilities.forEach(item=>{
      let option = document.createElement("option")
      option.value = item
      option.innerHTML = item
      options.appendChild(option)
    })
    

  }
  
  
}

function startProcess() {
  
  res.innerHTML = ""
  diceData = []

  if(!img){
    alert("Please upload an image")
    return
  }
  if(!options.value){
    alert("Please select a dice count")
    return
  }

  HORIZONTAL_DICE_COUNT = parseInt(options.value)
  diceSize = parseInt(img.width / HORIZONTAL_DICE_COUNT)

  canvas = document.querySelector("canvas#grayscale");
  ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  
  
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



function gcd(a, b){
  if (a == 0)
    return b;

  return gcd(b % a, a);
}

function commDivs(a, b){
  let n = gcd(a, b);

  let result = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {

    if (n % i == 0) {
      if (n / i == i){
        result.push(i)
      }
      else{
        result.push(n/i)
        result.push(i)
      }
    }
  }
  return result;
}