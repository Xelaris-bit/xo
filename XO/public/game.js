
const socket = new WebSocket(location.origin.replace(/^http/, 'ws'))

let mySymbol=null
let myTurn=false
let board=["","","","","","","","",""]

const statusText=document.getElementById("status")

socket.onmessage=event=>{

const data=JSON.parse(event.data)

if(data.type==="waiting"){
statusText.innerText="Waiting for opponent..."
}

if(data.type==="start"){
mySymbol=data.symbol
statusText.innerText="Game started. You are "+mySymbol
if(mySymbol==="X") myTurn=true
}

if(data.type==="move"){
board[data.index]=data.symbol
updateBoard()
myTurn=true
}

}

const scene=new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,1,0.1,1000)
const renderer=new THREE.WebGLRenderer({alpha:true})

renderer.setSize(420,420)
document.getElementById("board").appendChild(renderer.domElement)

camera.position.z=5

const grid=[]
const geometry=new THREE.BoxGeometry(1,1,0.1)

for(let i=0;i<9;i++){

const material=new THREE.MeshBasicMaterial({color:0x2b7cff})
const cube=new THREE.Mesh(geometry,material)

cube.position.x=(i%3)-1
cube.position.y=1-Math.floor(i/3)

cube.userData.index=i

scene.add(cube)
grid.push(cube)
}

function animate(){
requestAnimationFrame(animate)
renderer.render(scene,camera)
}
animate()

renderer.domElement.addEventListener("click",event=>{

if(!myTurn) return

const mouse=new THREE.Vector2(
(event.offsetX/420)*2-1,
-(event.offsetY/420)*2+1
)

const raycaster=new THREE.Raycaster()
raycaster.setFromCamera(mouse,camera)

const intersects=raycaster.intersectObjects(grid)

if(intersects.length>0){

const cube=intersects[0].object
const index=cube.userData.index

if(board[index]!=="") return

board[index]=mySymbol
updateBoard()

socket.send(JSON.stringify({index:index,symbol:mySymbol}))

myTurn=false

}

})

function updateBoard(){

grid.forEach((cube,i)=>{

if(board[i]==="X"){cube.material.color.set(0xff4444)}
if(board[i]==="O"){cube.material.color.set(0x00ff99)}

})

}

const canvas=document.getElementById("bg")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let particles=[]

for(let i=0;i<60;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2
})
}

function bgAnimate(){

ctx.clearRect(0,0,canvas.width,canvas.height)

particles.forEach(p=>{

ctx.beginPath()
ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
ctx.fillStyle="rgba(0,200,255,0.5)"
ctx.fill()

p.y+=0.3
if(p.y>canvas.height)p.y=0

})

requestAnimationFrame(bgAnimate)
}

bgAnimate()
