const socket = io() 

socket.emit("event", "Bienvenidos")
socket.on("evento", (res)=>console.log(res))
