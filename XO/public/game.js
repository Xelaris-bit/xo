const socket = new WebSocket(location.origin.replace(/^http/, 'ws'))

let mySymbol = null
let myTurn = false
let gameOver = false

let board = ["","","","","","","","",""]

const statusText = document.getElementById("status")
const boardDiv = document.getElementById("board")

const winPatterns = [

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

]

function createBoard(){

boardDiv.innerHTML=""

board.forEach((_,i)=>{

const cell = document.createElement("div")
cell.classList.add("cell")

cell.addEventListener("click",()=>playerMove(i))

boardDiv.appendChild(cell)

})

}

function playerMove(index){

if(!myTurn) return
if(gameOver) return
if(board[index] !== "") return

board[index] = mySymbol

updateBoard()

socket.send(JSON.stringify({

index:index,
symbol:mySymbol

}))

myTurn = false

checkWinner()

}

socket.onmessage = event => {

const data = JSON.parse(event.data)

if(data.type === "waiting"){
statusText.innerText="Waiting for opponent..."
}

if(data.type === "start"){

mySymbol = data.symbol

statusText.innerText = "Game Started. You are " + mySymbol

if(mySymbol === "X") myTurn = true

}

if(data.type === "move"){

board[data.index] = data.symbol

updateBoard()

myTurn = true

checkWinner()

}

}

function updateBoard(){

const cells = document.querySelectorAll(".cell")

cells.forEach((cell,i)=>{

cell.innerText = board[i]

})

}

function checkWinner(){

for(let pattern of winPatterns){

const [a,b,c] = pattern

if(board[a] && board[a] === board[b] && board[a] === board[c]){

gameOver = true

highlightWin(pattern)

if(board[a] === mySymbol){
statusText.innerText="You Win 🎉"
}else{
statusText.innerText="You Lose 😢"
}

return

}

}

if(!board.includes("")){

gameOver = true
statusText.innerText="Draw Game"

}

}

function highlightWin(pattern){

const cells = document.querySelectorAll(".cell")

pattern.forEach(i=>{
cells[i].classList.add("win")
})

}

function restartGame(){

location.reload()

}

createBoard()
