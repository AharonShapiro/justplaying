document.addEventListener('DOMContentLoaded',() => {  
 const grid = document.querySelector('.grid')
 let squares = Array.from(document.querySelectorAll('.grid div'))
 const ScoreDisplay = document.querySelector('#score')
 const startBtn = document.querySelector('#start-button')
 const width = 10
 let nextRandom = 0
 let timerID
 let score = 0
 const colors = [
  'orange',
  'red',
  'purple',
  'green',
  'blue'
 ]
 // The Tertrominoes

 const lTetromino = [
  [1,width+1,width*2+1,2],
  [width,width+1,width+2,width*2+2],
  [1,width+1,width*2+1,width*2],
  [width,width*2,width*2+1,width*2+2]
 ]

 const zTetromino =[
  [0,width,width+1,width*2+1],
  [1,width,width+1,2],
  [0,width,width+1,width*2+1],
  [1,width,width+1,2]
 ]

 const tTetromino = [
  [width,width+1,width+2,width*2+1],
  [width,width*2,width*3,width*2+1],
  [width+1,width*2,width*2+1,width*2+2],
  [width+2,width*2+1,width*2+2,width*3+2]
 ]

 const oTetromino = [
  [0,width,1,width+1],
  [0,width,1,width+1],
  [0,width,1,width+1],
  [0,width,1,width+1]
 ]

 const iTetromino = [
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3],
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3]
 ]

 const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

 let currentPosition = 4
 let currentRotation = 0

 //randomly select a tetro
 let random = Math.floor(Math.random()*theTetrominoes.length)
 let current = theTetrominoes[random][currentRotation]

 //draw the first tetrimino
 function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('tetromino')
    squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}

//undraw the Tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('tetromino')
    squares[currentPosition + index].style.backgroundColor = ''
  })
}

//make the tetro move down every second 
//timerID = setInterval(moveDown, 1000)

//assign functions to keycodes
function control(e) {
  if(e.keyCode === 37) {
    moveLeft()
  } else if (e.keyCode === 38){
    rotate()
  } else if (e.keyCode === 39){
    moveRight()
  } else if (e.keyCode === 40){
    moveDown()
  }
}
document.addEventListener('keyup',control)


//move down function
function moveDown(){
  undraw()
  currentPosition +=width
  draw()
  freeze()
}

//freeze statement 
function freeze() {
  if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
    current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    //start a new tetro falling
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
  }
}
// move the tetro, unless at end or blocked
function moveLeft (){
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if(!isAtLeftEdge) currentPosition -=1
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    currentPosition +=1
  }
draw()
}

//move the tetro right, unless it is at the edge of blocked 
function moveRight() {
  undraw()
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
  if(!isAtRightEdge) currentPosition +=1
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
  currentPosition -=1
}
draw()
}
//rotate the tetro
function rotate () {
  undraw()
  currentRotation ++
  if(currentRotation === current.length) { //If current rotation = 4, make it go back to 0
    currentRotation = 0
  }
  current = theTetrominoes[random][currentRotation]
  draw()
}

//Show up next tetro in mini grid 
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0


// Each tetro wit only first rotation
const upNextTetro = [
  [1, displayWidth+1, displayWidth*2+1,2], //Ltetro
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetro
  [1, displayWidth, displayWidth+1, displayWidth+2], //tTetro
  [0, 1, displayWidth, displayWidth+1], //oTetro
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetro
]

//display the shape in the mini-grid display
function displayShape() {
  //remove any trace of a tetromino from the gri
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''
  })
  upNextTetro[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}

// add functionality to the button 
startBtn.addEventListener('click', () => {
  if(timerID) {
    clearInterval(timerID)
    timerID = null
  } else {
    draw()
    timerID = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
  }
})

// add score function 
function addScore () {
 for (let i = 0; i < 199; i += width){
const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

  if(row.every(index => squares[index].classList.contains('taken'))){
      score += 10
      ScoreDisplay.innerHTML = score 
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor = ''
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

//Game over function
function gameOver() { 
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    ScoreDisplay.innerHTML = 'end'
    clearInterval(timerID)
  }
}





})


